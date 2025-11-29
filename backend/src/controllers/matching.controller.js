const matchingService = require('../services/matching.service');
const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { createResponse } = require('../utils/helpers');

/**
 * @route   POST /api/v1/matching/request
 * @desc    Create match request
 * @access  Private (Parent)
 */
const createMatchRequest = asyncHandler(async (req, res) => {
  const matchRequest = await matchingService.createMatchRequest(
    req.user.parent.id,
    req.body
  );
  res.status(201).json(
    createResponse(true, { matchRequest }, 'Match request created. Finding tutors...')
  );
});

/**
 * @route   GET /api/v1/matching/notifications
 * @desc    Get match notifications (for tutor)
 * @access  Private (Tutor)
 */
const getMatchNotifications = asyncHandler(async (req, res) => {
  const matchRequests = await matchingService.getTutorMatchNotifications(
    req.user.tutor.id
  );
  res.json(createResponse(true, { matchRequests }));
});

/**
 * @route   POST /api/v1/matching/:id/accept
 * @desc    Accept match request
 * @access  Private (Tutor)
 */
const acceptMatch = asyncHandler(async (req, res) => {
  const matchRequest = await matchingService.acceptMatchRequest(
    req.params.id,
    req.user.tutor.id
  );
  res.json(
    createResponse(true, { matchRequest }, 'Match accepted. Awaiting parent confirmation.')
  );
});

/**
 * @route   POST /api/v1/matching/:id/confirm
 * @desc    Confirm match and create session
 * @access  Private (Parent)
 */
const confirmMatch = asyncHandler(async (req, res) => {
  const session = await matchingService.confirmMatch(
    req.params.id,
    req.user.parent.id,
    req.body
  );
  res.json(createResponse(true, { session }, 'Session scheduled successfully'));
});

module.exports = {
  createMatchRequest,
  getMatchNotifications,
  acceptMatch,
  confirmMatch,
};

