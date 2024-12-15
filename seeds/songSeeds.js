const pool = require('./seedConfig');

const sampleSongs = [
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: 235,
    image_url: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    audio_url: "https://res.cloudinary.com/diozalxnh/video/upload/v1/spotify-clone/songs/shape-of-you.mp3",
    genre: "Pop"
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    image_url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    audio_url: "https://res.cloudinary.com/diozalxnh/video/upload/v1/spotify-clone/songs/blinding-lights.mp3",
    genre: "Pop"
  }
];

async function seedSongs() {
  try {
    // Clear existing songs
    await pool.query('DELETE FROM songs');

    // Insert new songs
    for (const song of sampleSongs) {
      await pool.query(
        `INSERT INTO songs (title, artist, album, duration, image_url, audio_url, genre)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [song.title, song.artist, song.album, song.duration, song.image_url, song.audio_url, song.genre]
      );
    }

    console.log('Songs seeded successfully');
    await pool.end(); // Close the connection
    process.exit(0);
  } catch (error) {
    console.error('Error seeding songs:', error);
    process.exit(1);
  }
}

seedSongs(); 