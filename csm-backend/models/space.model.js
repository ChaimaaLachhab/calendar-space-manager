const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true }
}, { _id: false });

const spaceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: {
    type: String,
    enum: {
      values: ['bureau', 'salle de réunion', 'espace événementiel', 'coworking', 'studio'],
      message: '{VALUE} n\'est pas une catégorie valide'
    },
    required: true
  },
  location: {
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  price: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  amenities: [{
    type: String,
    enum: {
      values: ['WiFi', 'projecteur', 'cuisine', 'climatisation', 'parking', 'terrasse'],
      message: '{VALUE} n\'est pas un équipement valide'
    }
  }],
  images: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Media' 
  }],
  availability: [availabilitySchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);
