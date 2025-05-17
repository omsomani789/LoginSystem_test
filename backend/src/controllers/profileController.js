import User from '../models/User.js';
import { comparePassword } from '../config/security.js';

// View profile controller
export const viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return formatted profile without password
    res.json({
      id: user.id,
      fullName: user.full_name,
      mobileNumber: user.mobile_number
    });
  } catch (error) {
    console.error('Profile view error:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

// Update profile controller
export const updateProfile = async (req, res) => {
  try {
    const { fullName, mobileNumber } = req.body;
    const userId = req.user.userId;

    // Check if mobile number is already taken by another user
    if (mobileNumber) {
      const existingUser = await User.findByMobileNumber(mobileNumber);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: 'Mobile number already in use' });
      }
    }

    // Update user profile
    const success = await User.updateProfile(userId, { fullName, mobileNumber });
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get updated user data
    const updatedUser = await User.findById(userId);
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        fullName: updatedUser.full_name,
        mobileNumber: updatedUser.mobile_number
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.message.includes('{')) {
      const validationErrors = JSON.parse(error.message);
      return res.status(400).json({ errors: validationErrors });
    }
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// Update password controller
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const success = await User.updatePassword(userId, { newPassword });
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    if (error.message.includes('{')) {
      const validationErrors = JSON.parse(error.message);
      return res.status(400).json({ errors: validationErrors });
    }
    res.status(500).json({ error: 'Error updating password' });
  }
}; 