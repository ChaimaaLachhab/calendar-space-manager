const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: String,
    location: String,
    capacity: Number,
    images: [String],
    availability: [
      {
        start: Date,
        end: Date
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Space', spaceSchema);