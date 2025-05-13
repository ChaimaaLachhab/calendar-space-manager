// utils/fileUploadUtil.js
const path = require('path');

class FileUploadUtil {
  static MAX_FILE_SIZE = 5 * 1024 * 1024;
  static MEDIA_PATTERN = /^.*\.(jpg|jpeg|png|gif|bmp|tif|webp|svg|mp4|avi|mov|mkv|webm)$/i;
  static DATE_FORMAT = 'yyyyMMddHHmmss';
  
  static isAllowedExtension(fileName) {
    return this.MEDIA_PATTERN.test(fileName);
  }
  
  static assertAllowed(file) {
    if (!file) {
      throw new Error('No file provided');
    }
    
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('Max file size is 5MB');
    }
    
    if (!this.isAllowedExtension(file.originalname)) {
      throw new Error('Invalid file type');
    }
  }
  
  static getFileName(originalName) {
    const timestamp = new Date().toISOString()
      .replace(/[-:T]/g, '')
      .replace(/\.\d+Z$/, '');
    
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    
    return `${baseName}_${timestamp}${extension}`;
  }
}

module.exports = FileUploadUtil;