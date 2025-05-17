'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import profileService, { ProfileData } from '@/services/profile';
import useAuthStore from '@/store/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { token, user, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileData>();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile(token);
        setValue('fullName', profile.fullName);
        setValue('mobileNumber', profile.mobileNumber);
      } catch (error: any) {
        if (error.response?.status === 401) {
          clearAuth();
          router.push('/login');
        } else {
          toast.error('Failed to load profile');
        }
      }
    };

    fetchProfile();
  }, [token, router, setValue, clearAuth]);

  const onSubmit = async (data: ProfileData) => {
    if (!token) return;

    try {
      setIsLoading(true);
      await profileService.updateProfile(token, data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    type="text"
                    disabled={!isEditing}
                    {...register('fullName', {
                      required: 'Full name is required',
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: 'Full name can only contain letters and spaces',
                      },
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1">
                  <input
                    id="mobileNumber"
                    type="tel"
                    disabled={!isEditing}
                    {...register('mobileNumber', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Mobile number must be 10 digits',
                      },
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.mobileNumber.message}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-6">
              <Link
                href="/profile/password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Change Password →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 