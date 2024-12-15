const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { getAllSongs, addSong, uploadSong } = require('../controllers/songController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/songs
router.get('/', getAllSongs);

// POST /api/songs
router.post('/', protect, addSong);

// POST /api/songs/upload
router.post('/upload', protect, fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}), uploadSong);

module.exports = router; 