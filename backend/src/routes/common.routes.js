const express = require('express');
const { prisma } = require('../config/database');
const { authenticate } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { createResponse } = require('../utils/helpers');

const router = express.Router();

/**
 * @route   GET /api/v1/common/subjects
 * @desc    Get all subjects
 * @access  Public
 */
router.get('/subjects', asyncHandler(async (req, res) => {
  const subjects = await prisma.subject.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
  res.json(createResponse(true, { subjects }));
}));

/**
 * @route   GET /api/v1/common/grades
 * @desc    Get all grades
 * @access  Public
 */
router.get('/grades', asyncHandler(async (req, res) => {
  const grades = await prisma.grade.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
  res.json(createResponse(true, { grades }));
}));

/**
 * @route   GET /api/v1/common/cities
 * @desc    Get list of cities
 * @access  Public
 */
router.get('/cities', asyncHandler(async (req, res) => {
  const cities = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo',
    'Anuradhapura', 'Trincomalee', 'Batticaloa', 'Matara',
    'Kurunegala', 'Ratnapura', 'Badulla', 'Gampaha', 'Kalutara'
  ];
  res.json(createResponse(true, { cities }));
}));

/**
 * @route   GET /api/v1/common/provinces
 * @desc    Get list of provinces
 * @access  Public
 */
router.get('/provinces', asyncHandler(async (req, res) => {
  const provinces = [
    'Western', 'Central', 'Southern', 'Northern',
    'Eastern', 'North Western', 'North Central',
    'Uva', 'Sabaragamuwa'
  ];
  res.json(createResponse(true, { provinces }));
}));

module.exports = router;

