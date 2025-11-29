const { prisma } = require('../config/database');
const { SESSION_STATUS } = require('../config/constants');
const { uploadFile } = require('./cloudinary.service');
const { createNotification } = require('./notification.service');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler.middleware');

/**
 * Create session
 */
async function createSession(data) {
  const session = await prisma.session.create({
    data: {
      tutorId: data.tutorId,
      parentId: data.parentId,
      studentId: data.studentId,
      subjectId: data.subjectId,
      gradeId: data.gradeId,
      sessionDate: new Date(data.sessionDate),
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration || 120,
      location: data.location,
      status: SESSION_STATUS.SCHEDULED,
      totalAmount: data.totalAmount || 4000,
      tutorAmount: data.tutorAmount || 2000,
      platformAmount: data.platformAmount || 2000,
    },
    include: {
      tutor: true,
      parent: true,
      student: true,
      subject: true,
      grade: true,
    },
  });

  // Notify tutor and parent
  await Promise.all([
    createNotification(
      session.tutor.userId,
      'SESSION',
      'New Session Scheduled',
      `Session scheduled for ${data.sessionDate} at ${data.startTime}`,
      { sessionId: session.id }
    ),
    createNotification(
      session.parent.userId,
      'SESSION',
      'Session Confirmed',
      `Your session has been scheduled for ${data.sessionDate}`,
      { sessionId: session.id }
    ),
  ]);

  return session;
}

/**
 * Get session by ID
 */
async function getSessionById(sessionId) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      tutor: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      parent: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      student: {
        include: {
          grade: true,
        },
      },
      subject: true,
      grade: true,
      payment: true,
      review: true,
    },
  });

  if (!session) {
    throw new NotFoundError('Session not found');
  }

  return session;
}

/**
 * Mark attendance
 */
async function markAttendance(sessionId, tutorId, attendanceStatus) {
  // Verify session belongs to tutor
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      tutorId,
    },
  });

  if (!session) {
    throw new NotFoundError('Session not found');
  }

  if (session.status !== SESSION_STATUS.SCHEDULED) {
    throw new ValidationError('Can only mark attendance for scheduled sessions');
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: {
      attendanceMarked: true,
      attendanceStatus,
      attendanceTime: new Date(),
      status: SESSION_STATUS.IN_PROGRESS,
    },
  });

  // Notify parent
  await createNotification(
    session.parentId,
    'SESSION',
    'Attendance Marked',
    `Attendance marked for session on ${session.sessionDate}`,
    { sessionId }
  );

  return updated;
}

/**
 * Submit session report
 */
async function submitSessionReport(sessionId, tutorId, reportData, file) {
  // Verify session belongs to tutor
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      tutorId,
    },
  });

  if (!session) {
    throw new NotFoundError('Session not found');
  }

  let reportUrl = null;
  if (file) {
    const uploaded = await uploadFile(
      file.buffer,
      file.originalname,
      'business-master/reports'
    );
    reportUrl = uploaded.url;
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: {
      reportSubmitted: true,
      reportUrl,
      summary: reportData.summary,
      homework: reportData.homework,
      status: SESSION_STATUS.COMPLETED,
    },
  });

  // Update tutor statistics
  await prisma.tutor.update({
    where: { id: tutorId },
    data: {
      completedClasses: {
        increment: 1,
      },
      totalEarnings: {
        increment: session.tutorAmount,
      },
      availableBalance: {
        increment: session.tutorAmount,
      },
    },
  });

  // Notify parent
  await createNotification(
    session.parentId,
    'SESSION',
    'Session Report Available',
    `Session report has been submitted for ${session.sessionDate}`,
    { sessionId }
  );

  return updated;
}

/**
 * Cancel session
 */
async function cancelSession(sessionId, userId, reason) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      tutor: true,
      parent: true,
    },
  });

  if (!session) {
    throw new NotFoundError('Session not found');
  }

  // Check if user is authorized to cancel
  if (session.tutor.userId !== userId && session.parent.userId !== userId) {
    throw new ValidationError('Not authorized to cancel this session');
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: SESSION_STATUS.CANCELLED,
    },
  });

  // Notify other party
  const notifyUserId = session.tutor.userId === userId 
    ? session.parent.userId 
    : session.tutor.userId;

  await createNotification(
    notifyUserId,
    'SESSION',
    'Session Cancelled',
    `Session on ${session.sessionDate} has been cancelled. Reason: ${reason}`,
    { sessionId }
  );

  return updated;
}

/**
 * Get sessions with filters
 */
async function getSessions(filters = {}) {
  const where = {};

  if (filters.tutorId) where.tutorId = filters.tutorId;
  if (filters.parentId) where.parentId = filters.parentId;
  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.status) where.status = filters.status;

  if (filters.startDate && filters.endDate) {
    where.sessionDate = {
      gte: new Date(filters.startDate),
      lte: new Date(filters.endDate),
    };
  }

  const sessions = await prisma.session.findMany({
    where,
    include: {
      tutor: {
        select: {
          id: true,
          fullName: true,
          performanceScore: true,
          averageRating: true,
        },
      },
      parent: {
        select: {
          id: true,
          fullName: true,
        },
      },
      student: {
        select: {
          id: true,
          fullName: true,
        },
      },
      subject: true,
      grade: true,
      payment: true,
    },
    orderBy: {
      sessionDate: 'desc',
    },
  });

  return sessions;
}

module.exports = {
  createSession,
  getSessionById,
  markAttendance,
  submitSessionReport,
  cancelSession,
  getSessions,
};

