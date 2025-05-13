// controllers/space.controller.js
const Space = require('../models/space.model');
const Media = require('../models/media.model');
const CloudinaryService = require('./cloudinary.controller');
const mongoose = require('mongoose');
const createError = require('http-errors');

// GET all spaces (with filters)
exports.getSpaces = async (req, res, next) => {
  try {
    const filters = {};
    const { location, category, capacity } = req.query;

    if (location) filters.location = location;
    if (category) filters.category = category;
    if (capacity) filters.capacity = { $gte: parseInt(capacity) };

    console.log('Fetching spaces with filters:', filters);
    
    // Using populate to include user information and image details
    const spaces = await Space.find(filters)
      .populate({
        path: 'createdBy',
        select: 'fullName email',
        model: 'User'
      })
      .populate({
        path: 'images',
        select: 'mediaUrl',
        model: 'Media'
      })
      .lean() // Convert to plain JS object for better performance
      .exec();
    
    console.log(`Found ${spaces.length} spaces`);
    
    res.status(200).json(spaces);
  } catch (err) {
    console.error('Error fetching spaces:', err);
    next(err);
  }
};

// GET space by ID
exports.getSpaceById = async (req, res, next) => {
  try {
    const space = await Space.findById(req.params.id)
      .populate({
        path: 'createdBy',
        select: 'fullName email',
        model: 'User'
      })
      .populate({
        path: 'images',
        select: 'mediaUrl',
        model: 'Media'
      })
      .lean()
      .exec();
    
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }
    
    res.status(200).json(space);
  } catch (err) {
    next(err);
  }
};

exports.createSpace = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const spaceData = JSON.parse(req.body.spaceData || '{}');
    const files = req.files || [];
    
    // Create the space
    const newSpace = new Space({
      ...spaceData,
      createdBy: req.user.id,
      images: [] // Initialize with empty array
    });
    
    // Save the space to get an ID
    const savedSpace = await newSpace.save({ session });
    
    // Handle image uploads if any
    if (files.length > 0) {
      // Upload images to Cloudinary
      const uploadResults = await CloudinaryService.uploadMultipleFiles(files, 'spaces');
      
      // Create media documents
      const mediaPromises = uploadResults.map(result => {
        const media = new Media({
          mediaUrl: result.url,
          mediaId: result.publicId,
          type: 'PHOTO',
          space: savedSpace._id
        });
        return media.save({ session });
      });
      
      const savedMedia = await Promise.all(mediaPromises);
      
      // Update space with image references
      savedSpace.images = savedMedia.map(media => media._id);
      await savedSpace.save({ session });
    }
    
    await session.commitTransaction();
    
    // Fetch the space with populated images
    const populatedSpace = await Space.findById(savedSpace._id)
      .populate('images')
      .exec();
    
    res.status(201).json(populatedSpace);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// Update a space
exports.updateSpace = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const spaceId = req.params.id;
    const spaceData = JSON.parse(req.body.spaceData || '{}');
    const files = req.files || [];
    
    // Find the space
    const space = await Space.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }
    
    // Check if user is authorized
    if (space.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this space' });
    }
    
    // Update space data
    Object.assign(space, spaceData);
    
    // Handle image uploads if any
    if (files.length > 0) {
      // Upload images to Cloudinary
      const uploadResults = await CloudinaryService.uploadMultipleFiles(files, 'spaces');
      
      // Create media documents
      const mediaPromises = uploadResults.map(result => {
        const media = new Media({
          mediaUrl: result.url,
          mediaId: result.publicId,
          type: 'PHOTO',
          space: space._id
        });
        return media.save({ session });
      });
      
      const savedMedia = await Promise.all(mediaPromises);
      
      // Add new images to existing ones
      space.images = [...space.images, ...savedMedia.map(media => media._id)];
    }
    
    // Save updated space
    await space.save({ session });
    
    await session.commitTransaction();
    
    // Fetch the updated space with populated images
    const populatedSpace = await Space.findById(space._id)
      .populate('images')
      .exec();
    
    res.status(200).json(populatedSpace);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// Delete a space image
exports.deleteSpaceImage = async (req, res, next) => {
  try {
    const { spaceId, imageId } = req.params;
    
    // Find the space
    const space = await Space.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }
    
    // Check if user is authorized
    if (space.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this space' });
    }
    
    // Find the media
    const media = await Media.findById(imageId);
    
    if (!media) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from Cloudinary
    await CloudinaryService.deleteFile(media.mediaId);
    
    // Remove reference from space
    space.images = space.images.filter(img => img.toString() !== imageId);
    await space.save();
    
    // Delete media document
    await Media.findByIdAndDelete(imageId);
    
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE remove space
exports.deleteSpace = async (req, res, next) => {
  try {
    const deleted = await Space.findByIdAndDelete(req.params.id);
    if (!deleted) throw createError(404, 'Espace non trouvé');
    res.status(200).json({ message: 'Espace supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};
