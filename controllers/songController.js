const { pool } = require('../config/db');
const uploadAudio = require('../utils/uploadAudio');
const cloudinary = require('cloudinary').v2;

const getAllSongs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM songs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSong = async (req, res) => {
  try {
    const { title, artist, album, duration, imageUrl, audioUrl, genre } = req.body;
    
    const result = await pool.query(
      `INSERT INTO songs (title, artist, album, duration, image_url, audio_url, genre) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, artist, album, duration, imageUrl, audioUrl, genre]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const uploadSong = async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;
    const audioFile = req.files.audio;
    const imageFile = req.files.image;

    // Upload files to Cloudinary
    const audioUrl = await uploadAudio(audioFile.tempFilePath);
    const imageResult = await cloudinary.uploader.upload(imageFile.tempFilePath);

    // Calculate duration (you might want to use a library like music-metadata)
    const duration = 180; // placeholder duration in seconds

    const result = await pool.query(
      `INSERT INTO songs (title, artist, album, duration, image_url, audio_url, genre)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, artist, album, duration, imageResult.secure_url, audioUrl, genre]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAllSongs, addSong, uploadSong }; 