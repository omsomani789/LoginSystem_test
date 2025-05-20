import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface SignupData {
  fullName: string;
  mobileNumber: string;
  password: string;
}

export interface LoginData {
  mobileNumber: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    fullName: string;
    mobileNumber: string;
  };
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
}

const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await axios.post<ApiResponse<AuthResponse>>(`${API_URL}/auth/signup`, data);
      if (response.data.status === 0) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', { mobileNumber: data.mobileNumber });
      const response = await axios.post<ApiResponse<AuthResponse>>(`${API_URL}/auth/login`, data);
      console.log('Login response:', response.data);
      
      if (response.data.status === 0) {
        throw new Error(response.data.message);
      }
      return response.data.data!;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async getProfile(token: string): Promise<AuthResponse['user']> {
    try {
      console.log('Fetching profile with token:', token);
      const response = await axios.get<ApiResponse<AuthResponse['user']>>(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Profile response:', response.data);
      
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
  }
};

export default authService; 