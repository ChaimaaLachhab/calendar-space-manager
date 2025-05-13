// controllers/cloudinary.controller.js
const cloudinary = require('../config/cloudinaryConfig');
const FileUploadUtil = require('../utils/fileUploadUtil');
const fs = require('fs');
const { promisify } = require('util');
const streamifier = require('streamifier');

class CloudinaryService {
  
  static async uploadFile(file, folderPath = 'spaces') {
    try {
      FileUploadUtil.assertAllowed(file);
      
      const fileName = FileUploadUtil.getFileName(file.originalname);
      const publicId = `nhndev/${folderPath}/${fileName}`;
      
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) {
              return reject(new Error('Failed to upload file to Cloudinary'));
            }
            
            if (!result.secure_url || !result.public_id) {
              return reject(new Error('Cloudinary upload did not return expected results'));
            }
            
            resolve({
              publicId: result.public_id,
              url: result.secure_url
            });
          }
        );
        
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
  
  static async uploadMultipleFiles(files, folderPath = 'spaces') {
    const uploadPromises = files.map(file => this.uploadFile(file, folderPath));
    return Promise.all(uploadPromises);
  }
  
  static async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}

module.exports = CloudinaryService;