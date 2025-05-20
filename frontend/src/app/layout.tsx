import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Login System',
  description: 'A secure login system with authentication and profile management',
}

const theme = createTheme({
  primaryColor: 'blue',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider theme={theme}>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
} 