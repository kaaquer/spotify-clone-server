require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const seedPool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = seedPool; 