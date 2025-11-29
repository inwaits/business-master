const multer = require('multer');
const path = require('path');
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require('../config/constants');
const { ValidationError } = require('./errorHandler.middleware');

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

// Middleware for single file upload
const uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for multiple file uploads
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Middleware for multiple fields
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
};

