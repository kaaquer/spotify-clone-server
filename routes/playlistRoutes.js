const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createPlaylist, 
  getUserPlaylists, 
  addSongToPlaylist,
  getPlaylistById,
  removeSongFromPlaylist,
  deletePlaylist
} = require('../controllers/playlistController');

// POST /api/playlists/add-song - Add song to playlist
router.post('/add-song', protect, addSongToPlaylist);

// GET /api/playlists - Get user's playlists
router.get('/', protect, getUserPlaylists);

// POST /api/playlists - Create new playlist
router.post('/', protect, createPlaylist);

// GET /api/playlists/:id - Get specific playlist with songs
router.get('/:id', protect, getPlaylistById);

// DELETE /api/playlists/:playlistId/songs/:songId - Remove song from playlist
router.delete('/:playlistId/songs/:songId', protect, removeSongFromPlaylist);

// DELETE /api/playlists/:id - Delete playlist
router.delete('/:id', protect, deletePlaylist);

module.exports = router; 