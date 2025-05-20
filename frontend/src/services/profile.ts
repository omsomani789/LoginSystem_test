import axios from 'axios';
import { ApiResponse } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface ProfileData {
  fullName: string;
  mobileNumber: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileResponse {
  id: number;
  fullName: string;
  mobileNumber: string;
}

const profileService = {
  async getProfile(token: string): Promise<ProfileResponse> {
    try {
      const response = await axios.get<ApiResponse<ProfileResponse>>(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status === 0) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      console.error('Get profile error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async updateProfile(token: string, data: ProfileData): Promise<ProfileResponse> {
    try {
      const response = await axios.put<ApiResponse<{ user: ProfileResponse }>>(`${API_URL}/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status === 0) {
        throw new Error(response.data.message);
      }
      return response.data.data!.user;
    } catch (error: any) {
      console.error('Update profile error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async updatePassword(token: string, data: PasswordData): Promise<void> {
    try {
      const response = await axios.put<ApiResponse<null>>(`${API_URL}/profile/password`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status === 0) {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Update password error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
};

export default profileService; 