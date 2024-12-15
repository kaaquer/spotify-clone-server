const { pool } = require('../config/db');

const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creator_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO playlists (name, description, creator_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [name, description, creator_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT * FROM playlists 
       WHERE creator_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const userId = req.user.id;

    // Check if user owns the playlist
    const playlistCheck = await pool.query(
      'SELECT * FROM playlists WHERE id = $1 AND creator_id = $2',
      [playlistId, userId]
    );

    if (playlistCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to modify this playlist' });
    }

    // Check if song already exists in playlist
    const songCheck = await pool.query(
      'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    );

    if (songCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Song already exists in playlist' });
    }

    await pool.query(
      'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)',
      [playlistId, songId]
    );

    res.status(201).json({ message: 'Song added to playlist' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get playlist details
    const playlistResult = await pool.query(
      `SELECT p.*, u.username as creator_name 
       FROM playlists p 
       JOIN users u ON p.creator_id = u.id 
       WHERE p.id = $1`,
      [id]
    );

    if (playlistResult.rows.length === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Get songs in playlist
    const songsResult = await pool.query(
      `SELECT s.* 
       FROM songs s 
       JOIN playlist_songs ps ON s.id = ps.song_id 
       WHERE ps.playlist_id = $1 
       ORDER BY ps.added_at DESC`,
      [id]
    );

    const playlist = playlistResult.rows[0];
    playlist.songs = songsResult.rows;

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    const userId = req.user.id;

    // Check if user owns the playlist
    const playlistCheck = await pool.query(
      'SELECT * FROM playlists WHERE id = $1 AND creator_id = $2',
      [playlistId, userId]
    );

    if (playlistCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to modify this playlist' });
    }

    // Check if song exists in playlist
    const songCheck = await pool.query(
      'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    );

    if (songCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Song not found in playlist' });
    }

    await pool.query(
      'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    );

    res.json({ message: 'Song removed from playlist' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user owns the playlist
    const playlistCheck = await pool.query(
      'SELECT * FROM playlists WHERE id = $1 AND creator_id = $2',
      [id, userId]
    );

    if (playlistCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this playlist' });
    }

    // Delete playlist songs first (due to foreign key constraint)
    await pool.query('DELETE FROM playlist_songs WHERE playlist_id = $1', [id]);
    
    // Delete the playlist
    await pool.query('DELETE FROM playlists WHERE id = $1', [id]);

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { 
  createPlaylist, 
  getUserPlaylists, 
  addSongToPlaylist,
  getPlaylistById,
  removeSongFromPlaylist,
  deletePlaylist
}; 