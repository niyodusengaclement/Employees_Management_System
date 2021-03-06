import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DB_URL });

export default {
  query(text, params) {
    try {
      return pool.query(text, params);
    } catch (err) {
      return err;
    }
  },
};
