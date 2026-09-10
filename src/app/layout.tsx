import type { Metadata, Viewport } from 'next';

import { env } from '@/lib/config/env';
import '@/styles/globals.css';

import { AppProviders } from './providers';

/**
 * Pretendard 는 jsDelivr 의 dynamic subset 을 쓴다.
 * 한글 서브셋이 unicode-range 로 쪼개져 있어 실제로 쓰이는 글자만 내려받는다.
 *
 * 셀프 호스팅으로 옮기려면 woff2 를 public/fonts 에 두고 next/font/local 로 바꾼다.
 * 그때까지는 외부 요청 1회를 감수한다. 폰트가 없어도 시스템 한글 폰트로 읽힌다.
 */
const PRETENDARD_CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';

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
    { media: '(prefers-color-scheme: light)', color: '#fcfbf9' },
    { media: '(prefers-color-scheme: dark)', color: '#14110e' },
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
      <body className="min-h-dvh bg-page text-ink antialiased">
        {/* React 19 가 stylesheet/preconnect 링크를 <head> 로 올려준다.
            App Router 에서 <head> 를 직접 렌더하면 하이드레이션이 깨진다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={PRETENDARD_CSS} precedence="default" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
