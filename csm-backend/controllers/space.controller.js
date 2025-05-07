// controllers/space.controller.js
const Space = require('../models/space.model');
const createError = require('http-errors');

// GET all spaces (with filters)
exports.getSpaces = async (req, res, next) => {
  try {
    const filters = {};
    const { location, category, capacity } = req.query;

    if (location) filters.location = location;
    if (category) filters.category = category;
    if (capacity) filters.capacity = { $gte: capacity };

    const spaces = await Space.find(filters);
    res.status(200).json(spaces);
  } catch (err) {
    next(err);
  }
};

// POST create space
exports.createSpace = async (req, res, next) => {
  try {
    const newSpace = new Space({
      ...req.body,
      createdBy: req.user.id,
    });
    const saved = await newSpace.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// PUT update space
exports.updateSpace = async (req, res, next) => {
  try {
    const updated = await Space.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) throw createError(404, 'Espace non trouvé');
    res.status(200).json(updated);
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
