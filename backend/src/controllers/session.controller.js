const sessionService = require('../services/session.service');
const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { createResponse } = require('../utils/helpers');
const { uploadSingle } = require('../middleware/upload.middleware');

/**
 * @route   GET /api/v1/sessions
 * @desc    Get sessions with filters
 * @access  Private
 */
const getSessions = asyncHandler(async (req, res) => {
  const sessions = await sessionService.getSessions(req.query);
  res.json(createResponse(true, { sessions }));
});

/**
 * @route   GET /api/v1/sessions/:id
 * @desc    Get session by ID
 * @access  Private
 */
const getSessionById = asyncHandler(async (req, res) => {
  const session = await sessionService.getSessionById(req.params.id);
  res.json(createResponse(true, { session }));
});

/**
 * @route   POST /api/v1/sessions/:id/attendance
 * @desc    Mark attendance
 * @access  Private (Tutor)
 */
const markAttendance = asyncHandler(async (req, res) => {
  const session = await sessionService.markAttendance(
    req.params.id,
    req.user.tutor.id,
    req.body.attendanceStatus
  );
  res.json(createResponse(true, { session }, 'Attendance marked'));
});

/**
 * @route   POST /api/v1/sessions/:id/report
 * @desc    Submit session report
 * @access  Private (Tutor)
 */
const submitReport = [
  uploadSingle('reportFile'),
  asyncHandler(async (req, res) => {
    const session = await sessionService.submitSessionReport(
      req.params.id,
      req.user.tutor.id,
      req.body,
      req.file
    );
    res.json(createResponse(true, { session }, 'Report submitted'));
  })
];

/**
 * @route   POST /api/v1/sessions/:id/cancel
 * @desc    Cancel session
 * @access  Private
 */
const cancelSession = asyncHandler(async (req, res) => {
  const session = await sessionService.cancelSession(
    req.params.id,
    req.user.id,
    req.body.reason
  );
  res.json(createResponse(true, { session }, 'Session cancelled'));
});

module.exports = {
  getSessions,
  getSessionById,
  markAttendance,
  submitReport,
  cancelSession,
};

