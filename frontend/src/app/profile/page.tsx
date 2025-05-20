'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Anchor, TextInput, Button, Paper, Title, Text, Container, Stack, Group, Loader, Center, Divider, Card } from '@mantine/core';
import profileService, { ProfileData } from '@/services/profile';
import useAuthStore from '@/store/auth';

interface ProfileFormData {
  fullName: string;
  mobileNumber: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { token, user, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const form = useForm<ProfileFormData>({
    initialValues: {
      fullName: '',
      mobileNumber: '',
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

  // Fetch profile data only once when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setIsFetching(true);
        const data = await profileService.getProfile(token);
        setProfileData(data);
        form.setValues({
          fullName: data.fullName,
          mobileNumber: data.mobileNumber,
        });
      } catch (error: any) {
        console.error('Profile fetch error:', error);
        if (error.message === 'Unauthorized' || error.response?.status === 401) {
          clearAuth();
          router.push('/login');
        } else {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.error || 'Failed to load profile',
            color: 'red',
          });
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array means this runs once on mount

  const onSubmit = async (values: ProfileFormData) => {
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
      const updatedProfile = await profileService.updateProfile(token, {
        id: user?.id || 0,
        ...values,
      });
      setProfileData(updatedProfile);
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  // Show loading state while fetching profile data
  if (isFetching) {
    return (
      <Container size="xs" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Center>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text>Loading profile...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // If no profile data is available, don't render the form
  if (!profileData) {
    return null;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Paper radius="md" p="xl" withBorder>
          <Group justify="space-between" mb="xl">
            <Stack gap={0}>
              <Title order={2}>Welcome, {profileData.fullName}!</Title>
              <Text c="dimmed" size="sm">Manage your account settings and preferences</Text>
            </Stack>
            <Group>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Group>
          </Group>

          <Divider my="md" />

          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack>
              <Card withBorder p="md" radius="md">
                <Stack gap="md">
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    disabled={!isEditing}
                    {...form.getInputProps('fullName')}
                  />

                  <TextInput
                    label="Mobile Number"
                    placeholder="Enter your mobile number"
                    disabled={!isEditing}
                    {...form.getInputProps('mobileNumber')}
                  />

                  {isEditing && (
                    <Button
                      type="submit"
                      loading={isLoading}
                      fullWidth
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  )}
                </Stack>
              </Card>
            </Stack>
          </form>

          <Text mt="xl">
            <Anchor component="a" href="/profile/password">
              Change Password →
            </Anchor>
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
} 