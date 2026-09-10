import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
