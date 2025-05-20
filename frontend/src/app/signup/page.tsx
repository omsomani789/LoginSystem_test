'use client';

import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Anchor, TextInput, PasswordInput, Button, Paper, Title, Text, Container, Stack } from '@mantine/core';
import authService, { SignupData } from '@/services/auth';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      fullName: '',
      mobileNumber: '',
      password: '',
    },
    validate: {
      fullName: (value) => {
        if (!value) return 'Full name is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Full name can only contain letters and spaces';
        return null;
      },
      mobileNumber: (value) => {
        if (!value) return 'Mobile number is required';
        if (!/^[0-9]{10}$/.test(value)) return 'Mobile number must be 10 digits';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        return null;
      },
    },
  });

  const onSubmit = async (values: SignupData) => {
    try {
      setIsLoading(true);
      await authService.signup(values);
      notifications.show({
        title: 'Success',
        message: 'Account created successfully! Please login.',
        color: 'green',
      });
      router.push('/login');
    } catch (error: any) {
      if (error.response?.data?.error) {
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
          Create your account
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              size="md"
              {...form.getInputProps('fullName')}
            />

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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <Text ta="center" size="sm">
              Already have an account?{' '}
              <Anchor component="a" href="/login" size="sm">
                Sign in
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 