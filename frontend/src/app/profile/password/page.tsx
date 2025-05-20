'use client';

import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Anchor, PasswordInput, Button, Paper, Title, Text, Container, Stack } from '@mantine/core';
import profileService, { PasswordUpdateData } from '@/services/profile';
import useAuthStore from '@/store/auth';

export default function PasswordUpdatePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordUpdateData>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validate: {
      currentPassword: (value) => {
        if (!value) return 'Current password is required';
        return null;
      },
      newPassword: (value) => {
        if (!value) return 'New password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        return null;
      },
    },
  });

  const onSubmit = async (values: PasswordUpdateData) => {
    if (!token) return;

    try {
      setIsLoading(true);
      await profileService.updatePassword(token, values);
      notifications.show({
        title: 'Success',
        message: 'Password updated successfully',
        color: 'green',
      });
      form.reset();
      router.push('/profile');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update password';
      notifications.show({
        title: 'Error',
        message: errorMessage,
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
          Update Password
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              size="md"
              {...form.getInputProps('currentPassword')}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              size="md"
              {...form.getInputProps('newPassword')}
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              size="md"
              loading={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>

            <Text ta="center" size="sm">
              <Anchor component="a" href="/profile">
                ← Back to Profile
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 