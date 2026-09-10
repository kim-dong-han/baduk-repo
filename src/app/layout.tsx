import type { Metadata, Viewport } from 'next';

import { env } from '@/lib/config/env';
import '@/styles/globals.css';

import { AppProviders } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: '바둑 AI 기보 분석',
    template: '%s · 바둑 AI 기보 분석',
  },
  description: 'KataGo 로 기보를 분석하고, 매 수의 승률과 대안을 바둑판 위에서 확인한다.',
  applicationName: '바둑 AI 기보 분석',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '바둑 AI 기보 분석',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#161719' },
  ],
  width: 'device-width',
  initialScale: 1,
  // 바둑판을 손가락으로 확대해 볼 수 있어야 한다.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
