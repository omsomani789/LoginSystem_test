'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import authService, { SignupData } from '@/services/auth';
import useAuthStore from '@/store/auth';

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) => {
    try {
      setIsLoading(true);
      const response = await authService.signup(data);
      setAuth(response);
      toast.success('Account created successfully!');
      router.push('/profile');
    } catch (error: any) {
      if (error.response?.status === 400) {
        if (error.response.data.errors) {
          // Handle validation errors
          const validationErrors = error.response.data.errors;
          Object.values(validationErrors).forEach((error: any) => {
            toast.error(error);
          });
        } else if (error.response.data.error) {
          // Handle other 400 errors (e.g., mobile number already exists)
          toast.error(error.response.data.error);
        }
      } else {
        console.error('Signup error:', error);
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName', {
                    required: 'Full name is required',
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: 'Full name can only contain letters and spaces',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Mobile number must be 10 digits',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.mobileNumber && (
                  <p className="mt-2 text-sm text-red-600">{errors.mobileNumber.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 