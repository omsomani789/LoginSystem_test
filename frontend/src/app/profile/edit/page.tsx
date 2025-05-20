'use client';

import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { TextInput, Button, Paper, Title, Container, Stack } from '@mantine/core';
import useAuthStore from '@/store/auth';
import profileService from '@/services/profile';

export default function EditProfilePage() {
  const router = useRouter();
  const { token, user, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      fullName: user?.fullName || '',
      mobileNumber: user?.mobileNumber || '',
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
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    if (!token) {
      notifications.show({
        title: 'Error',
        message: 'You must be logged in to update your profile',
        color: 'red',
      });
      return;
    }

    try {
      setIsLoading(true);
      const updatedProfile = await profileService.updateProfile(token, values);
      
      // Update auth store with new user data
      setAuth({
        token,
        user: {
          id: user?.id || 0,
          ...updatedProfile
        }
      });

      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });

      router.push('/profile');
    } catch (error: any) {
      console.error('Profile update error:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update profile',
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
          Edit Profile
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              {...form.getInputProps('fullName')}
            />

            <TextInput
              label="Mobile Number"
              placeholder="Enter your mobile number"
              {...form.getInputProps('mobileNumber')}
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
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