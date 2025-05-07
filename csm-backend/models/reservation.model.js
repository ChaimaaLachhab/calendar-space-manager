const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Reservation', reservationSchema);