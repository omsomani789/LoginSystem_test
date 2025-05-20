'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Container, Paper, Title, Text, Stack, Button, Loader, Center } from '@mantine/core';
import useAuthStore from '@/store/auth';
import profileService from '@/services/profile';

export default function ProfilePage() {
  const router = useRouter();
  const { token, clearAuth } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.log('No token found, redirecting to login');
        router.replace('/login');
        return;
      }

      try {
        console.log('Fetching profile with token:', token);
        const data = await profileService.getProfile(token);
        console.log('Profile data received:', data);
        setProfileData(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        notifications.show({
          title: 'Error',
          message: error.message || 'Failed to fetch profile',
          color: 'red',
        });
        clearAuth();
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, router, clearAuth]);

  if (isLoading) {
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

  return (
    <Container size="xs" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper radius="md" p="xl" withBorder style={{ width: '100%' }}>
        <Title order={2} ta="center" mt="md" mb={50}>
          Profile
        </Title>

        <Stack>
          <Text size="lg">
            <strong>Full Name:</strong> {profileData?.fullName}
          </Text>
          <Text size="lg">
            <strong>Mobile Number:</strong> {profileData?.mobileNumber}
          </Text>

          <Button
            variant="outline"
            fullWidth
            mt="xl"
            onClick={() => router.push('/profile/edit')}
          >
            Edit Profile
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={() => router.push('/profile/password')}
          >
            Change Password
          </Button>

          <Button
            variant="outline"
            color="red"
            fullWidth
            onClick={() => {
              clearAuth();
              router.replace('/login');
            }}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
} 