import { pool } from '../config/database.js';
import { validateUser, validateProfileUpdate, validatePasswordUpdate } from './UserSchema.js';
import { hashPassword } from '../config/security.js';

class User {
  // Create a new user
  static async create(userData) {
    try {
      // Validate user data
      const { isValid, errors } = validateUser(userData);
      if (!isValid) {
        throw new Error(JSON.stringify(errors));
      }

      // Hash the password
      const hashedPassword = await hashPassword(userData.password);

      const query = `
        INSERT INTO users (full_name, mobile_number, password)
        VALUES (?, ?, ?)
      `;
      const [result] = await pool.query(query, [
        userData.fullName,
        userData.mobileNumber,
        hashedPassword
      ]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by mobile number
  static async findByMobileNumber(mobileNumber) {
    try {
      const query = 'SELECT * FROM users WHERE mobile_number = ?';
      const [rows] = await pool.query(query, [mobileNumber]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(id, userData) {
    try {
      // Validate profile data
      const { isValid, errors } = validateProfileUpdate(userData);
      if (!isValid) {
        throw new Error(JSON.stringify(errors));
      }

      const query = `
        UPDATE users 
        SET full_name = ?, mobile_number = ?
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [
        userData.fullName,
        userData.mobileNumber,
        id
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async updatePassword(id, userData) {
    try {
      // Validate password data
      const { isValid, errors } = validatePasswordUpdate(userData);
      if (!isValid) {
        throw new Error(JSON.stringify(errors));
      }

      // Hash the new password
      const hashedPassword = await hashPassword(userData.newPassword);

      const query = `
        UPDATE users 
        SET password = ?
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [hashedPassword, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // List all users (with pagination)
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const query = 'SELECT * FROM users LIMIT ? OFFSET ?';
      const [rows] = await pool.query(query, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default User; 