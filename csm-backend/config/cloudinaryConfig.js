// config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dniddbder',
  api_key: '684125745129812',
  api_secret: 'CJLZeQF8yrS9ZtDkmEnJ39esH44'
});

module.exports = cloudinary;