const { prisma } = require('../config/database');
const { TUTOR_VERIFICATION, MAX_TUTORS_TO_NOTIFY, MATCH_REQUEST_EXPIRY_HOURS } = require('../config/constants');
const { emitToUsers } = require('../sockets');
const { createBulkNotifications } = require('./notification.service');
const { sendMatchNotificationEmail } = require('./email.service');
const { sendMatchNotificationSMS } = require('./sms.service');

/**
 * Calculate match score for a tutor
 * @param {object} tutor - Tutor object
 * @param {object} matchRequest - Match request object
 * @returns {number} Match score (0-100)
 */
function calculateMatchScore(tutor, matchRequest) {
  let score = 0;

  // 1. Location Score (25 points)
  if (tutor.city.toLowerCase() === matchRequest.preferredCity.toLowerCase()) {
    score += 25;
  } else if (tutor.province.toLowerCase() === matchRequest.preferredCity.toLowerCase()) {
    score += 15;
  } else {
    score += 5;
  }

  // 2. Time Slot Match (25 points)
  const preferredTimes = matchRequest.preferredTimes || [];
  if (preferredTimes.length > 0 && tutor.availability.length > 0) {
    const matchedSlots = preferredTimes.filter(prefTime => 
      tutor.availability.some(avail => 
        avail.dayOfWeek === prefTime.dayOfWeek &&
        avail.isActive
      )
    );
    
    if (matchedSlots.length === preferredTimes.length) {
      score += 25;
    } else if (matchedSlots.length > 0) {
      score += 15;
    } else {
      score += 10;
    }
  } else {
    score += 10;
  }

  // 3. Performance Score (20 points)
  score += (tutor.performanceScore / 5) * 20;

  // 4. Rating (15 points)
  score += (tutor.averageRating / 5) * 15;

  // 5. Completion Rate (10 points)
  const completionRate = tutor.totalClasses > 0 
    ? tutor.completedClasses / tutor.totalClasses 
    : 0;
  score += completionRate * 10;

  // 6. Bonus Points (5 points)
  if (tutor.badges && tutor.badges.some(b => b.badgeType === 'PRIORITY')) {
    score += 5;
  } else if (tutor.totalClasses < 10) {
    score += 2;
  }

  return Math.min(score, 100);
}

/**
 * Find matching tutors for a request
 * @param {string} matchRequestId - Match request ID
 */
async function findMatchingTutors(matchRequestId) {
  // Get match request
  const matchRequest = await prisma.matchRequest.findUnique({
    where: { id: matchRequestId },
    include: {
      subject: true,
      grade: true,
    },
  });

  if (!matchRequest) {
    throw new Error('Match request not found');
  }

  // Find eligible tutors
  const eligibleTutors = await prisma.tutor.findMany({
    where: {
      verificationStatus: TUTOR_VERIFICATION.APPROVED,
      user: {
        status: 'ACTIVE',
      },
      isAvailable: true,
      subjects: {
        some: {
          subjectId: matchRequest.subjectId,
          gradeId: matchRequest.gradeId,
        },
      },
    },
    include: {
      user: true,
      subjects: {
        include: {
          subject: true,
          grade: true,
        },
      },
      availability: true,
      badges: true,
    },
  });

  // Calculate scores and sort
  const scoredTutors = eligibleTutors
    .map(tutor => ({
      tutor,
      score: calculateMatchScore(tutor, matchRequest),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_TUTORS_TO_NOTIFY);

  // Notify tutors
  if (scoredTutors.length > 0) {
    await notifyTutors(scoredTutors, matchRequest);
  }

  return scoredTutors;
}

/**
 * Notify tutors about match request
 */
async function notifyTutors(scoredTutors, matchRequest) {
  const tutorIds = scoredTutors.map(st => st.tutor.userId);

  // Create notifications
  await createBulkNotifications(
    tutorIds,
    'MATCH',
    'New Student Request',
    `New student looking for ${matchRequest.subject.name} tutor in ${matchRequest.preferredCity}`,
    {
      matchRequestId: matchRequest.id,
      subject: matchRequest.subject.name,
      grade: matchRequest.grade.name,
      city: matchRequest.preferredCity,
    }
  );

  // Emit socket events
  emitToUsers(tutorIds, 'match:new', {
    matchRequestId: matchRequest.id,
    subject: matchRequest.subject.name,
    grade: matchRequest.grade.name,
    city: matchRequest.preferredCity,
    expiresAt: matchRequest.expiresAt,
  });

  // Send emails and SMS to top 5 tutors
  const topTutors = scoredTutors.slice(0, 5);
  
  for (const { tutor } of topTutors) {
    try {
      await sendMatchNotificationEmail(tutor, matchRequest);
      if (tutor.phoneNumber) {
        await sendMatchNotificationSMS(tutor, matchRequest);
      }
    } catch (error) {
      console.error(`Failed to notify tutor ${tutor.id}:`, error);
    }
  }
}

/**
 * Create match request
 */
async function createMatchRequest(parentId, data) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + MATCH_REQUEST_EXPIRY_HOURS);

  const matchRequest = await prisma.matchRequest.create({
    data: {
      parentId,
      studentId: data.studentId,
      subjectId: data.subjectId,
      gradeId: data.gradeId,
      preferredCity: data.preferredCity,
      preferredTimes: data.preferredTimes || [],
      additionalNotes: data.additionalNotes,
      status: 'PENDING',
      expiresAt,
    },
    include: {
      subject: true,
      grade: true,
    },
  });

  // Find and notify tutors
  await findMatchingTutors(matchRequest.id);

  return matchRequest;
}

/**
 * Accept match request (Tutor)
 */
async function acceptMatchRequest(matchRequestId, tutorId) {
  // Use transaction to prevent race conditions
  const result = await prisma.$transaction(async (tx) => {
    // Check if request is still pending
    const matchRequest = await tx.matchRequest.findUnique({
      where: { id: matchRequestId },
    });

    if (!matchRequest) {
      throw new Error('Match request not found');
    }

    if (matchRequest.status !== 'PENDING') {
      throw new Error('Match request is no longer available');
    }

    if (new Date() > matchRequest.expiresAt) {
      throw new Error('Match request has expired');
    }

    // Update match request
    const updated = await tx.matchRequest.update({
      where: { id: matchRequestId },
      data: {
        status: 'MATCHED',
        matchedTutorId: tutorId,
        matchedAt: new Date(),
      },
      include: {
        subject: true,
        grade: true,
      },
    });

    return updated;
  });

  // Notify parent
  const parent = await prisma.parent.findUnique({
    where: { id: result.parentId },
    include: { user: true },
  });

  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
  });

  await createBulkNotifications(
    [parent.userId],
    'MATCH',
    'Tutor Matched!',
    `${tutor.fullName} has accepted your request. Please confirm to schedule.`,
    { matchRequestId: result.id }
  );

  // Notify other tutors
  emitToUsers([parent.userId], 'match:found', {
    matchRequestId: result.id,
    tutor: {
      id: tutor.id,
      fullName: tutor.fullName,
      performanceScore: tutor.performanceScore,
      averageRating: tutor.averageRating,
    },
  });

  return result;
}

/**
 * Confirm match and create session (Parent)
 */
async function confirmMatch(matchRequestId, parentId, sessionData) {
  const matchRequest = await prisma.matchRequest.findUnique({
    where: { id: matchRequestId },
  });

  if (!matchRequest || matchRequest.parentId !== parentId) {
    throw new Error('Match request not found');
  }

  if (matchRequest.status !== 'MATCHED') {
    throw new Error('No tutor has been matched yet');
  }

  // Create session
  const session = await prisma.session.create({
    data: {
      tutorId: matchRequest.matchedTutorId,
      parentId,
      studentId: matchRequest.studentId,
      subjectId: matchRequest.subjectId,
      gradeId: matchRequest.gradeId,
      sessionDate: new Date(sessionData.sessionDate),
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      duration: sessionData.duration || 120,
      location: sessionData.location,
      status: 'SCHEDULED',
      totalAmount: 4000,
      tutorAmount: 2000,
      platformAmount: 2000,
    },
  });

  // Update match request
  await prisma.matchRequest.update({
    where: { id: matchRequestId },
    data: {
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    },
  });

  // Notify tutor
  const tutor = await prisma.tutor.findUnique({
    where: { id: matchRequest.matchedTutorId },
    include: { user: true },
  });

  await createBulkNotifications(
    [tutor.userId],
    'SESSION',
    'Session Confirmed',
    `Your session has been scheduled for ${sessionData.sessionDate}`,
    { sessionId: session.id }
  );

  return session;
}

/**
 * Get match notifications for tutor
 */
async function getTutorMatchNotifications(tutorId) {
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    include: {
      subjects: true,
    },
  });

  const subjectIds = tutor.subjects.map(s => s.subjectId);
  const gradeIds = tutor.subjects.map(s => s.gradeId);

  const matchRequests = await prisma.matchRequest.findMany({
    where: {
      status: 'PENDING',
      subjectId: { in: subjectIds },
      gradeId: { in: gradeIds },
      expiresAt: { gt: new Date() },
    },
    include: {
      subject: true,
      grade: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return matchRequests;
}

module.exports = {
  calculateMatchScore,
  findMatchingTutors,
  createMatchRequest,
  acceptMatchRequest,
  confirmMatch,
  getTutorMatchNotifications,
};

