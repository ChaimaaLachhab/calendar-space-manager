// routes/space.routes.js
const express = require('express');
const router = express.Router();
const spaceCtrl = require('../controllers/space.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

router.get('/', spaceCtrl.getSpaces);
router.get('/:id', spaceCtrl.getSpaceById);
router.post('/', verifyToken, isAdmin, upload.array('images', 5), spaceCtrl.createSpace);
router.put('/:id', verifyToken, isAdmin, upload.array('images', 5), spaceCtrl.updateSpace);
router.delete('/:id', verifyToken, isAdmin, spaceCtrl.deleteSpace);
router.delete('/:spaceId/images/:imageId', verifyToken, isAdmin, spaceCtrl.deleteSpaceImage);

module.exports = router;
