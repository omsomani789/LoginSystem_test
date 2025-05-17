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
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    // Create new user
    const userId = await User.create({ fullName, mobileNumber, password });

    // Generate JWT token
    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        fullName,
        mobileNumber
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message.includes('{')) {
      const validationErrors = JSON.parse(error.message);
      return res.status(400).json({ errors: validationErrors });
    }
    res.status(500).json({ error: 'Error during signup' });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Find user by mobile number
    const user = await User.findByMobileNumber(mobileNumber);
    if (!user) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        mobileNumber: user.mobile_number
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
}; 