// routes/contact.routes.js
const express = require('express');
const router = express.Router();
const contactCtrl = require('../controllers/contact.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', contactCtrl.sendMessage);
router.get('/', verifyToken, isAdmin, contactCtrl.getAllMessages);
router.put('/:id/response', verifyToken, isAdmin, contactCtrl.respondMessage);

module.exports = router;
