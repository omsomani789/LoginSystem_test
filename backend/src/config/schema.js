import { pool } from './database.js';

const createUsersTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        full_name VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(15) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        INDEX idx_mobile_number (mobile_number)
      )
    `;
    
    await pool.query(query);
    console.log('Users table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating users table:', error);
    return false;
  }
};

const initializeDatabase = async () => {
  try {
    await createUsersTable();
    console.log('Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database schema:', error);
    return false;
  }
};

export { initializeDatabase }; 