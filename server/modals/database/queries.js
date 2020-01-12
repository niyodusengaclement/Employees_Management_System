const employees = `DROP TABLE IF EXISTS employees; CREATE TABLE IF NOT EXISTS employees
      (id SERIAL PRIMARY KEY, 
      employee_name VARCHAR(80) NOT NULL, 
      national_id VARCHAR(16) NOT NULL UNIQUE,
      passport_photo VARCHAR(255), 
      phone VARCHAR(12) NOT NULL UNIQUE, 
      email VARCHAR(50) NOT NULL UNIQUE, 
      dob VARCHAR(50) NOT NULL, 
      status VARCHAR(20) NOT NULL, 
      position VARCHAR(100) NOT NULL
      ); 
      INSERT INTO employees (employee_name, national_id, passport_photo, phone, email, dob, status, position) values
      ('NIYODUSENGA Clement', '1234567890123456', 'https://res.cloudinary.com/broadcaster/image/upload/v1575620340/fc57nmlnzki9p2pbwhmw.jpg', '0780282575', 'clementmistico@gmail.com', '10 Jan 1997', 'active', 'manager'),
      ('MISTICO Clement', '1234567890123420', 'https://res.cloudinary.com/broadcaster/image/upload/v1576604741/zoclzwsqafj4mhjueyhc.jpg', '0780282570', 'misticoclement@gmail.com', '01 Jan 1996', 'active', 'developer')
      `;
export default {
  employees,
};
