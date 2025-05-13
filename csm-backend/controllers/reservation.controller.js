// controllers/reservation.controller.js
const Reservation = require('../models/reservation.model');
const Space = require('../models/space.model');
const createError = require('http-errors');

// POST create reservation
exports.createReservation = async (req, res, next) => {
  try {
    const { spaceId, startDate, endDate } = req.body;

    const conflicts = await Reservation.findOne({
      spaceId,
      startDate: { $lt: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
    });

    if (conflicts) throw createError(409, 'Espace déjà réservé à ces dates.');

    const reservation = new Reservation({
      userId: req.user.id,
      spaceId,
      startDate,
      endDate,
      status: 'confirmed',
    });

    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// GET all reservations
exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
    .populate('spaceId')
    .populate({
      path: 'spaceId',
      select: 'title description location price capacity images',
      model: 'Space'
    })
    .populate({
      path: 'userId',
      select: 'fullName email',
      model: 'User'
    })
    .lean() // Convert to plain JS object for better performance
    .exec();
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

// GET user reservations
exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id }).populate('spaceId');
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

// DELETE reservation
exports.deleteReservation = async (req, res, next) => {
  try {
    const deleted = await Reservation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) throw createError(404, 'Réservation non trouvée');
    res.status(200).json({ message: 'Réservation annulée' });
  } catch (err) {
    next(err);
  }
};

// GET reserved date ranges for a space
exports.getReservedDatesBySpace = async (req, res, next) => {
  try {
    const { spaceId } = req.params;

    const reservations = await Reservation.find({ spaceId }).select('startDate endDate -_id');

    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};
