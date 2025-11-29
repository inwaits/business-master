const { prisma } = require('../config/database');
const { NotFoundError } = require('../middleware/errorHandler.middleware');

/**
 * Get parent profile
 */
async function getParentProfile(parentId) {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      },
      students: {
        include: {
          grade: true,
        },
      },
    },
  });

  if (!parent) {
    throw new NotFoundError('Parent not found');
  }

  return parent;
}

/**
 * Update parent profile
 */
async function updateParentProfile(parentId, data) {
  const parent = await prisma.parent.update({
    where: { id: parentId },
    data: {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      province: data.province,
    },
  });

  return getParentProfile(parentId);
}

/**
 * Add student
 */
async function addStudent(parentId, studentData) {
  const student = await prisma.student.create({
    data: {
      parentId,
      fullName: studentData.fullName,
      gradeId: studentData.gradeId,
      school: studentData.school,
      dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth) : null,
    },
    include: {
      grade: true,
    },
  });

  return student;
}

/**
 * Update student
 */
async function updateStudent(studentId, parentId, studentData) {
  // Verify student belongs to parent
  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      parentId,
    },
  });

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  const updated = await prisma.student.update({
    where: { id: studentId },
    data: {
      fullName: studentData.fullName,
      gradeId: studentData.gradeId,
      school: studentData.school,
      dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth) : null,
    },
    include: {
      grade: true,
    },
  });

  return updated;
}

/**
 * Get parent dashboard data
 */
async function getParentDashboard(parentId) {
  const parent = await getParentProfile(parentId);

  // Get upcoming sessions
  const upcomingSessions = await prisma.session.findMany({
    where: {
      parentId,
      sessionDate: {
        gte: new Date(),
      },
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
    },
    include: {
      tutor: {
        select: {
          id: true,
          fullName: true,
          performanceScore: true,
          averageRating: true,
        },
      },
      student: true,
      subject: true,
    },
    orderBy: {
      sessionDate: 'asc',
    },
    take: 5,
  });

  // Get pending payments
  const pendingPayments = await prisma.session.findMany({
    where: {
      parentId,
      status: 'COMPLETED',
      isPaid: false,
    },
    select: {
      id: true,
      sessionDate: true,
      totalAmount: true,
      subject: {
        select: { name: true },
      },
    },
  });

  // Get recent homework
  const recentHomework = await prisma.session.findMany({
    where: {
      parentId,
      homework: {
        not: null,
      },
    },
    select: {
      id: true,
      homework: true,
      sessionDate: true,
      subject: {
        select: { name: true },
      },
    },
    orderBy: {
      sessionDate: 'desc',
    },
    take: 5,
  });

  // Calculate statistics
  const totalSessions = await prisma.session.count({
    where: { parentId },
  });

  const completedSessions = await prisma.session.count({
    where: {
      parentId,
      status: 'COMPLETED',
    },
  });

  const totalSpent = await prisma.payment.aggregate({
    where: {
      parentId,
      status: 'COMPLETED',
    },
    _sum: {
      amount: true,
    },
  });

  return {
    parent,
    upcomingSessions,
    pendingPayments,
    recentHomework,
    statistics: {
      totalSessions,
      completedSessions,
      totalSpent: totalSpent._sum.amount || 0,
      pendingPaymentsCount: pendingPayments.length,
    },
  };
}

/**
 * Submit review
 */
async function submitReview(sessionId, parentId, reviewData) {
  // Verify session belongs to parent
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      parentId,
      status: 'COMPLETED',
    },
  });

  if (!session) {
    throw new NotFoundError('Session not found or not completed');
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: { sessionId },
  });

  if (existingReview) {
    throw new Error('Review already submitted for this session');
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      sessionId,
      tutorId: session.tutorId,
      parentId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      punctuality: reviewData.punctuality,
      knowledge: reviewData.knowledge,
      teaching: reviewData.teaching,
      behavior: reviewData.behavior,
    },
  });

  // Update tutor's average rating
  const allReviews = await prisma.review.findMany({
    where: { tutorId: session.tutorId },
    select: { rating: true },
  });

  const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await prisma.tutor.update({
    where: { id: session.tutorId },
    data: {
      averageRating,
      performanceScore: averageRating, // Simplified - you could make this more complex
    },
  });

  return review;
}

/**
 * Submit complaint
 */
async function submitComplaint(parentId, complaintData) {
  const complaint = await prisma.complaint.create({
    data: {
      parentId,
      tutorId: complaintData.tutorId,
      sessionId: complaintData.sessionId,
      subject: complaintData.subject,
      description: complaintData.description,
      status: 'PENDING',
    },
  });

  return complaint;
}

module.exports = {
  getParentProfile,
  updateParentProfile,
  addStudent,
  updateStudent,
  getParentDashboard,
  submitReview,
  submitComplaint,
};

