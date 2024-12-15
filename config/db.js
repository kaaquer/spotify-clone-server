const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL Connected');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Songs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        artist VARCHAR(100) NOT NULL,
        album VARCHAR(100) NOT NULL,
        duration INTEGER NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        audio_url VARCHAR(255) NOT NULL,
        genre VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Playlists table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        creator_id INTEGER REFERENCES users(id),
        image_url VARCHAR(255) DEFAULT 'default_playlist.jpg',
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Playlist_songs junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS playlist_songs (
        playlist_id INTEGER REFERENCES playlists(id),
        song_id INTEGER REFERENCES songs(id),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (playlist_id, song_id)
      );
    `);

    // Liked_songs junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS liked_songs (
        user_id INTEGER REFERENCES users(id),
        song_id INTEGER REFERENCES songs(id),
        liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, song_id)
      );
    `);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

module.exports = { pool, connectDB }; 