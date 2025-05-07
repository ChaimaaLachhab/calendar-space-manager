// routes/reservation.routes.js
const express = require('express');
const router = express.Router();
const reservationCtrl = require('../controllers/reservation.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, reservationCtrl.createReservation);
router.get('/my', verifyToken, reservationCtrl.getMyReservations);
router.delete('/:id', verifyToken, reservationCtrl.deleteReservation);

module.exports = router;
