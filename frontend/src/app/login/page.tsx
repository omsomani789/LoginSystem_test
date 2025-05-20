'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Anchor, TextInput, PasswordInput, Button, Paper, Title, Text, Container, Stack, Center, Loader } from '@mantine/core';
import authService, { LoginData } from '@/services/auth';
import useAuthStore from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, token, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      mobileNumber: '',
      password: '',
    },
    validate: {
      mobileNumber: (value) => {
        if (!value) return 'Mobile number is required';
        if (!/^[0-9]{10}$/.test(value)) return 'Mobile number must be 10 digits';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        return null;
      },
    },
  });

  // Check if already logged in
  useEffect(() => {
    if (token) {
      router.replace('/profile');
    }
  }, [token, router]);

  const onSubmit = async (values: LoginData) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', { mobileNumber: values.mobileNumber });
      
      const response = await authService.login(values);
      console.log('Login successful:', response);
      
      // Set auth state with the response data
      setAuth(response);
      
      // Show success message
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully!',
        color: 'green',
      });

      // Redirect to profile
      router.replace('/profile');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid mobile number or password') {
        notifications.show({
          title: 'Error',
          message: 'Invalid mobile number or password',
          color: 'red',
        });
      } else if (error.response?.data?.error) {
        notifications.show({
          title: 'Error',
          message: error.response.data.error,
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Something went wrong. Please try again.',
          color: 'red',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper radius="md" p="xl" withBorder style={{ width: '100%' }}>
        <Title order={2} ta="center" mt="md" mb={50}>
          Sign in to your account
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Mobile Number"
              placeholder="Enter your mobile number"
              size="md"
              {...form.getInputProps('mobileNumber')}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              size="md"
              {...form.getInputProps('password')}
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              size="md"
              loading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Text ta="center" size="sm">
              Don't have an account?{' '}
              <Anchor component="a" href="/signup" size="sm">
                Create one
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 