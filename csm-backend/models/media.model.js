// models/Media.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  mediaUrl: { 
    type: String, 
    required: true 
  },
  mediaId: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['PHOTO', 'VIDEO'],
    default: 'PHOTO'
  },
  space: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Space' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);