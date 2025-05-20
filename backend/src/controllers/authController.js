import User from '../models/User.js';
import { generateToken } from '../config/security.js';
import { comparePassword } from '../config/security.js';

// Signup controller
export const signup = async (req, res) => {
  try {
    const { fullName, mobileNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByMobileNumber(mobileNumber);
    if (existingUser) {
      return res.json({
        status: 0,
        message: 'Mobile number already registered',
        data: null
      });
    }

    // Create new user
    const userId = await User.create({ fullName, mobileNumber, password });

    // Generate JWT token
    const token = generateToken(userId);

    res.json({
      status: 1,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: userId,
          fullName,
          mobileNumber
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message.includes('{')) {
      const validationErrors = JSON.parse(error.message);
      return res.json({
        status: 0,
        message: 'Validation error',
        data: validationErrors
      });
    }
    res.json({
      status: 0,
      message: 'Error during signup',
      data: null
    });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Find user by mobile number
    const user = await User.findByMobileNumber(mobileNumber);
    if (!user) {
      return res.json({
        status: 0,
        message: 'Invalid mobile number or password',
        data: null
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        status: 0,
        message: 'Invalid mobile number or password',
        data: null
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      status: 1,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          mobileNumber: user.mobile_number
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({
      status: 0,
      message: 'Error during login',
      data: null
    });
  }
}; 