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

const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  }
};

export default authService; 