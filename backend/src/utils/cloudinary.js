import { v2 as cloudinary } from 'cloudinary';
import config from '../config/env.js';

/**
 * Cloudinary Configuration and Utility Functions
 * 
 * Handles file uploads to Cloudinary cloud storage.
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/**
 * Upload file to Cloudinary
 * 
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder path
 * @param {string} resourceType - Resource type (image, raw, video, auto)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, folder = 'intervuex/resumes', resourceType = 'raw') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        format: 'pdf',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary
 * 
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, raw, video)
 * @returns {Promise<Object>} Cloudinary delete result
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Get file URL from Cloudinary
 * 
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type
 * @returns {string} Secure URL
 */
export const getCloudinaryUrl = (publicId, resourceType = 'raw') => {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    secure: true,
  });
};

export default cloudinary;
