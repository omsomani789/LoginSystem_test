import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthResponse } from '@/services/auth';

interface AuthState {
  token: string | null;
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (data) => {
        set({ 
          token: data.token, 
          user: data.user,
          isAuthenticated: true 
        });
      },
      clearAuth: () => {
        set({ 
          token: null, 
          user: null,
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token;
        }
      },
    }
  )
);

export default useAuthStore; 