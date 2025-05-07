// controllers/contact.controller.js
const Contact = require('../models/contact.model');

// POST send contact message
exports.sendMessage = async (req, res, next) => {
  try {
    const contact = new Contact(req.body);
    const saved = await contact.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// GET all messages (admin)
exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find();
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

// PUT respond to message
exports.respondMessage = async (req, res, next) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        response: req.body.response,
        status: 'responded',
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
