import axios from 'axios';

export interface ProfileData {
  id: string;
  username: string;
  email: string;
  // Add other profile fields as needed
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const profileService = {
  async getProfile(): Promise<ProfileData> {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    const response = await axios.put(`${API_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
};

export default profileService; 