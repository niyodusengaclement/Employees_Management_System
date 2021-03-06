import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './database/index';

class ActionModal {
  constructor() {
    this.options = { expiresIn: '1d' };
  }

  async findEmployee(email, nid, phone) {
    const { rows } = await db.query('SELECT * FROM employees WHERE email = $1 OR national_id = $2 OR phone = $3', [email, nid, phone]);
    return rows[0];
  }

  async findEmployeeById(id) {
    const { rows } = await db.query('SELECT * FROM employees WHERE id = $1 ', [id]);
    return rows[0];
  }

  async findManager(email, nid, phone) {
    const { rows } = await db.query('SELECT * FROM managers WHERE email = $1 OR national_id = $2 OR phone = $3', [email, nid, phone]);
    return rows[0];
  }

  async addEmployee(data) {
    const text = 'INSERT INTO employees (employee_name, national_id, passport_photo, phone, email, dob, status, position) values ($1, $2, $8, $3, $4, $5, $6, $7) returning *';
    const { rows } = await db.query(text, data);
    return rows[0];
  }

  async addManager(data) {
    const text = 'INSERT INTO managers (employee_name, national_id, passport_photo, phone, email, dob, status, position, password) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *';
    const { rows } = await db.query(text, data);
    return rows[0];
  }

  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash(password, salt);
      return pass;
    } catch (err) {
      return err;
    }
  }

  confirmationLink(info) {
    try {
      const payload = {
        email: info.email,
        names: info.employee_name,
        status: info.status,
      };
      const token = jwt.sign(payload, process.env.SECRET, this.options);
      return token;
    } catch (err) {
      return err;
    }
  }

  verifyConfirmationLink(token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET, this.options);
      return decoded;
    } catch (err) {
      return err;
    }
  }

  async activateManager(email) {
    const text = `UPDATE managers SET status = 'active' WHERE email = $1 returning *`;
    const { rows } = await db.query(text, [email]);
    return rows[0];
  }

  generateToken(info) {
    try {
      const payload = {
        email: info.email,
        names: info.employee_name,
        status: info.status,
      };
      const token = jwt.sign(payload, process.env.SECRET, this.options);
      return token;
    } catch (err) {
      return err;
    }
  }

  async updateEmployee(data) {
    const text = 'UPDATE employees SET employee_name = $1, national_id = $2, phone = $3, email = $4, dob = $5, status = $6, position = $7 WHERE id = $8 returning *';
    const { rows } = await db.query(text, data);
    return rows[0];
  }

  async searchEmployee(input) {
    const { rows } = await db.query('SELECT * FROM employees WHERE email = $1 OR national_id = $1 OR phone = $1 OR position = $1 OR employee_name = $1', [input]);
    return rows[0];
  }

  generateResetToken(info) {
    try {
      const payload = {
        email: info.email,
        names: info.employee_name,
        status: info.status,
      };
      const token = jwt.sign(payload, info.password, this.options);
      return token;
    } catch (err) {
      return err;
    }
  }
}
export default new ActionModal();
