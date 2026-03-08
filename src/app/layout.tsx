import type { Metadata, Viewport } from 'next';
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar';
import { AppInitializer } from '@/components/AppInitializer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dara — Тренажёр дикции',
  description: 'Тренируй произношение каждый день за 15 минут',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dara',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#07070F',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="min-h-dvh antialiased">
        <main className="mx-auto max-w-md px-4 py-6">{children}</main>
        <AppInitializer />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
