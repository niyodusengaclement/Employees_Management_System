import db from './database/index';

class ActionModal {
  async findEmployee(email, nid, phone) {
    const { rows } = await db.query('SELECT * FROM employees WHERE email = $1 OR national_id = $2 OR phone = $3', [email, nid, phone]);
    return rows[0];
  }

  async addEmployee(data) {
    const text = 'INSERT INTO employees (employee_name, national_id, passport_photo, phone, email, dob, status, position) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *';
    const { rows } = await db.query(text, data);
    return rows[0];
  }
}
export default new ActionModal();
