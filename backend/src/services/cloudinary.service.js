const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { sanitizeFilename } = require('../utils/helpers');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} folder - Cloudinary folder
 */
async function uploadFile(buffer, originalName, folder = 'business-master') {
  try {
    // Create temporary file
    const tempDir = os.tmpdir();
    const sanitizedName = sanitizeFilename(originalName);
    const tempPath = path.join(tempDir, `${Date.now()}-${sanitizedName}`);
    
    // Write buffer to temp file
    await fs.writeFile(tempPath, buffer);
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(tempPath, folder);
    
    // Delete temp file
    await fs.unlink(tempPath);
    
    return result;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload multiple files
 * @param {Array} files - Array of file objects {buffer, originalName}
 * @param {string} folder - Cloudinary folder
 */
async function uploadMultipleFiles(files, folder = 'business-master') {
  const uploadPromises = files.map((file) =>
    uploadFile(file.buffer, file.originalname, folder)
  );
  
  return Promise.all(uploadPromises);
}

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
async function deleteFile(publicId) {
  try {
    await deleteFromCloudinary(publicId);
  } catch (error) {
    console.error('File delete error:', error);
  }
}

/**
 * Get public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
function getPublicIdFromUrl(url) {
  if (!url) return null;
  
  const matches = url.match(/\/([^\/]+)\.[^.]+$/);
  return matches ? matches[1] : null;
}

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getPublicIdFromUrl,
};

