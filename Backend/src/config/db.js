import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

db.connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

export default db;
