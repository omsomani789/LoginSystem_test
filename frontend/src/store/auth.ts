import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse } from '@/services/auth';

interface AuthState {
  token: string | null;
  user: AuthResponse['user'] | null;
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (data) => set({ token: data.token, user: data.user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore; 