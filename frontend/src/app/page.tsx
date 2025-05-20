'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Center, Loader, Text } from '@mantine/core';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to login page
    router.replace('/login');
  }, [router]);

  return (
    <Container size="xs" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Center>
        <div style={{ textAlign: 'center' }}>
          <Loader size="lg" />
          <Text mt="md">Redirecting to login...</Text>
        </div>
      </Center>
    </Container>
  );
} 