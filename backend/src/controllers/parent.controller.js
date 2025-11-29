const parentService = require('../services/parent.service');
const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { createResponse } = require('../utils/helpers');

/**
 * @route   GET /api/v1/parents/profile
 * @desc    Get parent profile
 * @access  Private (Parent)
 */
const getProfile = asyncHandler(async (req, res) => {
  const parent = await parentService.getParentProfile(req.user.parent.id);
  res.json(createResponse(true, { parent }));
});

/**
 * @route   PUT /api/v1/parents/profile
 * @desc    Update parent profile
 * @access  Private (Parent)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const parent = await parentService.updateParentProfile(
    req.user.parent.id,
    req.body
  );
  res.json(createResponse(true, { parent }, 'Profile updated'));
});

/**
 * @route   GET /api/v1/parents/dashboard
 * @desc    Get parent dashboard data
 * @access  Private (Parent)
 */
const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await parentService.getParentDashboard(req.user.parent.id);
  res.json(createResponse(true, dashboard));
});

/**
 * @route   POST /api/v1/parents/students
 * @desc    Add student
 * @access  Private (Parent)
 */
const addStudent = asyncHandler(async (req, res) => {
  const student = await parentService.addStudent(
    req.user.parent.id,
    req.body
  );
  res.status(201).json(createResponse(true, { student }, 'Student added'));
});

/**
 * @route   PUT /api/v1/parents/students/:id
 * @desc    Update student
 * @access  Private (Parent)
 */
const updateStudent = asyncHandler(async (req, res) => {
  const student = await parentService.updateStudent(
    req.params.id,
    req.user.parent.id,
    req.body
  );
  res.json(createResponse(true, { student }, 'Student updated'));
});

/**
 * @route   POST /api/v1/parents/reviews
 * @desc    Submit review
 * @access  Private (Parent)
 */
const submitReview = asyncHandler(async (req, res) => {
  const review = await parentService.submitReview(
    req.body.sessionId,
    req.user.parent.id,
    req.body
  );
  res.status(201).json(createResponse(true, { review }, 'Review submitted'));
});

/**
 * @route   POST /api/v1/parents/complaints
 * @desc    Submit complaint
 * @access  Private (Parent)
 */
const submitComplaint = asyncHandler(async (req, res) => {
  const complaint = await parentService.submitComplaint(
    req.user.parent.id,
    req.body
  );
  res.status(201).json(createResponse(true, { complaint }, 'Complaint submitted'));
});

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  addStudent,
  updateStudent,
  submitReview,
  submitComplaint,
};

