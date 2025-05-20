import axios from 'axios';

export interface ProfileData {
  id: number;
  fullName: string;
  mobileNumber: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle rate limiting with exponential backoff
const handleRateLimit = async (error: any, retryCount = 0): Promise<any> => {
  if (error.response?.status === 429 && retryCount < 3) {
    const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
    console.log(`Rate limited. Retrying in ${waitTime}ms...`);
    await delay(waitTime);
    return true; // Retry the request
  }
  return false; // Don't retry
};

const profileService = {
  async getProfile(token: string): Promise<ProfileData> {
    let retryCount = 0;
    
    while (retryCount < 3) {
      try {
        console.log('Making GET request to:', `${API_URL}/profile`);
        console.log('With token:', token);
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Profile response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Profile GET error:', error.response || error);
        
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        
        const shouldRetry = await handleRateLimit(error, retryCount);
        if (!shouldRetry) {
          throw error;
        }
        
        retryCount++;
      }
    }
    
    throw new Error('Failed to fetch profile after multiple retries');
  },

  async updateProfile(token: string, data: Partial<ProfileData>): Promise<ProfileData> {
    let retryCount = 0;
    
    while (retryCount < 3) {
      try {
        console.log('Making PUT request to:', `${API_URL}/profile`);
        console.log('With data:', data);
        console.log('With token:', token);
        const response = await axios.put(`${API_URL}/profile`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Profile update response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Profile PUT error:', error.response || error);
        
        if (error.response?.status === 401) {
          throw new Error('Unauthorized');
        }
        
        const shouldRetry = await handleRateLimit(error, retryCount);
        if (!shouldRetry) {
          throw error;
        }
        
        retryCount++;
      }
    }
    
    throw new Error('Failed to update profile after multiple retries');
  },

  async updatePassword(token: string, data: PasswordUpdateData): Promise<void> {
    let retryCount = 0;
    
    while (retryCount < 3) {
      try {
        console.log('Making PUT request to:', `${API_URL}/profile/password`);
        console.log('With data:', { ...data, newPassword: '[REDACTED]' });
        console.log('With token:', token);
        const response = await axios.put(
          `${API_URL}/profile/password`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Password update response:', response.data);
        return;
      } catch (error: any) {
        console.error('Password update error:', error.response || error);
        
        if (error.response?.status === 401) {
          throw new Error('Current password is incorrect');
        }
        
        const shouldRetry = await handleRateLimit(error, retryCount);
        if (!shouldRetry) {
          throw error;
        }
        
        retryCount++;
      }
    }
    
    throw new Error('Failed to update password after multiple retries');
  },
};

export default profileService; 