// routes/space.routes.js
const express = require('express');
const router = express.Router();
const spaceCtrl = require('../controllers/space.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', spaceCtrl.getSpaces);
router.post('/', verifyToken, isAdmin, spaceCtrl.createSpace);
router.put('/:id', verifyToken, isAdmin, spaceCtrl.updateSpace);
router.delete('/:id', verifyToken, isAdmin, spaceCtrl.deleteSpace);

module.exports = router;
