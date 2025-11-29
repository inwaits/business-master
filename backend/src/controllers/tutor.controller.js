const tutorService = require('../services/tutor.service');
const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { createResponse } = require('../utils/helpers');
const { uploadFields } = require('../middleware/upload.middleware');

/**
 * @route   GET /api/v1/tutors/profile
 * @desc    Get tutor profile
 * @access  Private (Tutor)
 */
const getProfile = asyncHandler(async (req, res) => {
  const tutor = await tutorService.getTutorProfile(req.user.tutor.id);
  res.json(createResponse(true, { tutor }));
});

/**
 * @route   PUT /api/v1/tutors/profile/complete
 * @desc    Complete tutor profile with documents
 * @access  Private (Tutor)
 */
const completeProfile = [
  uploadFields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'universityId', maxCount: 1 }
  ]),
  asyncHandler(async (req, res) => {
    const tutor = await tutorService.completeTutorProfile(
      req.user.tutor.id,
      req.body,
      req.files
    );
    res.json(createResponse(true, { tutor }, 'Profile completed successfully'));
  })
];

/**
 * @route   PUT /api/v1/tutors/subjects
 * @desc    Update tutor subjects
 * @access  Private (Tutor)
 */
const updateSubjects = asyncHandler(async (req, res) => {
  const tutor = await tutorService.updateTutorSubjects(
    req.user.tutor.id,
    req.body.subjects
  );
  res.json(createResponse(true, { tutor }, 'Subjects updated'));
});

/**
 * @route   PUT /api/v1/tutors/availability
 * @desc    Update tutor availability
 * @access  Private (Tutor)
 */
const updateAvailability = asyncHandler(async (req, res) => {
  const tutor = await tutorService.updateTutorAvailability(
    req.user.tutor.id,
    req.body.availability
  );
  res.json(createResponse(true, { tutor }, 'Availability updated'));
});

/**
 * @route   GET /api/v1/tutors/sessions
 * @desc    Get tutor sessions
 * @access  Private (Tutor)
 */
const getSessions = asyncHandler(async (req, res) => {
  const sessions = await tutorService.getTutorSessions(
    req.user.tutor.id,
    req.query
  );
  res.json(createResponse(true, { sessions }));
});

/**
 * @route   GET /api/v1/tutors/earnings
 * @desc    Get tutor earnings
 * @access  Private (Tutor)
 */
const getEarnings = asyncHandler(async (req, res) => {
  const earnings = await tutorService.getTutorEarnings(req.user.tutor.id);
  res.json(createResponse(true, { earnings }));
});

/**
 * @route   GET /api/v1/tutors/search
 * @desc    Search tutors (for parents)
 * @access  Private
 */
const searchTutors = asyncHandler(async (req, res) => {
  const tutors = await tutorService.searchTutors(req.query);
  res.json(createResponse(true, { tutors }));
});

/**
 * @route   GET /api/v1/tutors/:id
 * @desc    Get tutor by ID
 * @access  Private
 */
const getTutorById = asyncHandler(async (req, res) => {
  const tutor = await tutorService.getTutorProfile(req.params.id);
  res.json(createResponse(true, { tutor }));
});

module.exports = {
  getProfile,
  completeProfile,
  updateSubjects,
  updateAvailability,
  getSessions,
  getEarnings,
  searchTutors,
  getTutorById,
};

