import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 개발 서버는 기본적으로 다른 호스트에서 오는 /_next 요청을 막는다.
  // Playwright 가 127.0.0.1 로 접속하므로 허용해 둔다.
  // (허용하지 않으면 클라이언트 번들이 차단되어 하이드레이션이 일어나지 않는다)
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  // 분석 결과 이미지/썸네일은 아직 없다. 필요해지면 remotePatterns 를 추가한다.
  images: {
    remotePatterns: [],
  },

  typescript: {
    // 타입 오류는 빌드를 막는다. (CI 에서 걸러지도록 유지)
    ignoreBuildErrors: false,
  },

  // Next 16 부터 next.config 의 eslint 옵션과 `next lint` 는 제거되었다.
  // 린트는 `npm run lint` (eslint flat config) 로 직접 실행한다.
};

export default nextConfig;
