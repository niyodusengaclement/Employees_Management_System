import { Pool } from 'pg';
import dotenv from 'dotenv';
import queries from './queries';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DB_URL });

pool.on('connect', () => {
  console.log('Database connected');
});

const createEmployeesTables = async () => {
  try {
    await pool.query(queries.employees);
  } catch (err) {
    console.log(err);
  }
};

pool.on('remove', () => {
  console.log('Connection terminated');
  process.exit(0);
});

module.exports = {
  createEmployeesTables,
};

require('make-runnable');
