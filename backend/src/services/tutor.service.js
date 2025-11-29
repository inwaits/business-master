const { prisma } = require('../config/database');
const { uploadFile } = require('./cloudinary.service');
const { TUTOR_VERIFICATION } = require('../config/constants');
const { sendTutorVerificationEmail } = require('./email.service');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler.middleware');

/**
 * Get tutor profile
 */
async function getTutorProfile(tutorId) {
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      },
      subjects: {
        include: {
          subject: true,
          grade: true,
        },
      },
      availability: {
        where: { isActive: true },
      },
      badges: true,
    },
  });

  if (!tutor) {
    throw new NotFoundError('Tutor not found');
  }

  return tutor;
}

/**
 * Complete tutor profile with documents
 */
async function completeTutorProfile(tutorId, data, files) {
  // Upload documents to Cloudinary
  let idDocumentUrl, universityIdUrl;

  if (files.idDocument) {
    const idDoc = await uploadFile(
      files.idDocument[0].buffer,
      files.idDocument[0].originalname,
      'business-master/documents/id'
    );
    idDocumentUrl = idDoc.url;
  }

  if (files.universityId) {
    const uniDoc = await uploadFile(
      files.universityId[0].buffer,
      files.universityId[0].originalname,
      'business-master/documents/university'
    );
    universityIdUrl = uniDoc.url;
  }

  // Update tutor profile
  const tutor = await prisma.tutor.update({
    where: { id: tutorId },
    data: {
      idDocumentUrl,
      universityIdUrl,
      verificationStatus: TUTOR_VERIFICATION.DOCUMENTS_SUBMITTED,
    },
  });

  // Add subjects
  if (data.subjects && data.subjects.length > 0) {
    await prisma.tutorSubject.createMany({
      data: data.subjects.map(s => ({
        tutorId,
        subjectId: s.subjectId,
        gradeId: s.gradeId,
        hourlyRate: s.hourlyRate || 2000,
      })),
      skipDuplicates: true,
    });
  }

  // Add availability
  if (data.availability && data.availability.length > 0) {
    await prisma.tutorAvailability.createMany({
      data: data.availability.map(a => ({
        tutorId,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
        isActive: true,
      })),
    });
  }

  return getTutorProfile(tutorId);
}

/**
 * Update tutor subjects
 */
async function updateTutorSubjects(tutorId, subjects) {
  // Delete existing subjects
  await prisma.tutorSubject.deleteMany({
    where: { tutorId },
  });

  // Add new subjects
  await prisma.tutorSubject.createMany({
    data: subjects.map(s => ({
      tutorId,
      subjectId: s.subjectId,
      gradeId: s.gradeId,
      hourlyRate: s.hourlyRate || 2000,
    })),
  });

  return getTutorProfile(tutorId);
}

/**
 * Update tutor availability
 */
async function updateTutorAvailability(tutorId, availability) {
  // Delete existing availability
  await prisma.tutorAvailability.deleteMany({
    where: { tutorId },
  });

  // Add new availability
  await prisma.tutorAvailability.createMany({
    data: availability.map(a => ({
      tutorId,
      dayOfWeek: a.dayOfWeek,
      startTime: a.startTime,
      endTime: a.endTime,
      isActive: true,
    })),
  });

  return getTutorProfile(tutorId);
}

/**
 * Get tutor sessions
 */
async function getTutorSessions(tutorId, filters = {}) {
  const where = { tutorId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.startDate && filters.endDate) {
    where.sessionDate = {
      gte: new Date(filters.startDate),
      lte: new Date(filters.endDate),
    };
  }

  const sessions = await prisma.session.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
        },
      },
      subject: true,
      grade: true,
      parent: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
    },
    orderBy: {
      sessionDate: 'desc',
    },
  });

  return sessions;
}

/**
 * Get tutor earnings
 */
async function getTutorEarnings(tutorId) {
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    select: {
      totalEarnings: true,
      availableBalance: true,
      completedClasses: true,
    },
  });

  // Get pending payments
  const pendingSessions = await prisma.session.findMany({
    where: {
      tutorId,
      status: 'COMPLETED',
      isPaid: false,
    },
    select: {
      tutorAmount: true,
    },
  });

  const pendingBalance = pendingSessions.reduce((sum, s) => sum + s.tutorAmount, 0);

  // Get recent payments
  const recentPayments = await prisma.session.findMany({
    where: {
      tutorId,
      isPaid: true,
    },
    select: {
      id: true,
      sessionDate: true,
      tutorAmount: true,
      payment: {
        select: {
          paymentDate: true,
          status: true,
        },
      },
    },
    orderBy: {
      sessionDate: 'desc',
    },
    take: 10,
  });

  return {
    totalEarnings: tutor.totalEarnings,
    availableBalance: tutor.availableBalance,
    pendingBalance,
    completedClasses: tutor.completedClasses,
    recentPayments,
  };
}

/**
 * Search tutors (for parent)
 */
async function searchTutors(filters = {}) {
  const where = {
    verificationStatus: TUTOR_VERIFICATION.APPROVED,
    isAvailable: true,
    user: {
      status: 'ACTIVE',
    },
  };

  if (filters.subjectId && filters.gradeId) {
    where.subjects = {
      some: {
        subjectId: filters.subjectId,
        gradeId: filters.gradeId,
      },
    };
  }

  if (filters.city) {
    where.city = filters.city;
  }

  const tutors = await prisma.tutor.findMany({
    where,
    include: {
      subjects: {
        include: {
          subject: true,
          grade: true,
        },
      },
      availability: {
        where: { isActive: true },
      },
      badges: true,
    },
    orderBy: filters.sortBy === 'rating' 
      ? { averageRating: 'desc' }
      : { performanceScore: 'desc' },
  });

  return tutors;
}

/**
 * Get pending tutor approvals (Admin)
 */
async function getPendingTutorApprovals() {
  return prisma.tutor.findMany({
    where: {
      verificationStatus: TUTOR_VERIFICATION.DOCUMENTS_SUBMITTED,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      },
      subjects: {
        include: {
          subject: true,
          grade: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

/**
 * Approve/Reject tutor (Admin)
 */
async function verifyTutor(tutorId, action, reason = null) {
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    include: { user: true },
  });

  if (!tutor) {
    throw new NotFoundError('Tutor not found');
  }

  const updates = {
    verifiedAt: new Date(),
  };

  if (action === 'APPROVE') {
    updates.verificationStatus = TUTOR_VERIFICATION.APPROVED;
    updates.user = {
      update: {
        status: 'ACTIVE',
      },
    };
  } else {
    updates.verificationStatus = TUTOR_VERIFICATION.REJECTED;
    updates.rejectionReason = reason;
  }

  const updated = await prisma.tutor.update({
    where: { id: tutorId },
    data: updates,
    include: { user: true },
  });

  // Send notification email
  await sendTutorVerificationEmail(updated, action, reason);

  return updated;
}

module.exports = {
  getTutorProfile,
  completeTutorProfile,
  updateTutorSubjects,
  updateTutorAvailability,
  getTutorSessions,
  getTutorEarnings,
  searchTutors,
  getPendingTutorApprovals,
  verifyTutor,
};

