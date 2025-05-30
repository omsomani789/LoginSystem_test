'use client';

import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { PasswordInput, Button, Paper, Title, Container, Stack } from '@mantine/core';
import useAuthStore from '@/store/auth';
import profileService from '@/services/profile';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value) => {
        if (!value) return 'Current password is required';
        return null;
      },
      newPassword: (value) => {
        if (!value) return 'New password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Please confirm your password';
        if (value !== values.newPassword) return 'Passwords do not match';
        return null;
      },
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    if (!token) {
      notifications.show({
        title: 'Error',
        message: 'You must be logged in to change your password',
        color: 'red',
      });
      return;
    }

    try {
      setIsLoading(true);
      await profileService.updatePassword(token, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      notifications.show({
        title: 'Success',
        message: 'Password updated successfully',
        color: 'green',
      });

      router.push('/profile');
    } catch (error: any) {
      console.error('Password update error:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update password',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper radius="md" p="xl" withBorder style={{ width: '100%' }}>
        <Title order={2} ta="center" mt="md" mb={50}>
          Change Password
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              {...form.getInputProps('currentPassword')}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              {...form.getInputProps('newPassword')}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              {...form.getInputProps('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push('/profile')}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 