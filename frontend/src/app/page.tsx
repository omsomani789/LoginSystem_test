'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome to Login System</h1>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
} 