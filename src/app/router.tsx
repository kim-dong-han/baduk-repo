import { createBrowserRouter } from 'react-router';

/**
 * 라우트 정의.
 *
 * 화면 코드는 lazy 로 나눠 첫 진입 번들에 들어가지 않게 한다.
 * 특히 바둑판·차트는 무겁기 때문에 분석 화면에 들어갈 때 받아야 한다.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/routes/root'),
    children: [
      {
        index: true,
        lazy: () => import('@/routes/home'),
      },
      {
        path: 'layout-demo',
        lazy: () => import('@/routes/layout-demo/route'),
      },
      {
        path: 'design-system',
        lazy: () => import('@/routes/design-system/route'),
      },
      {
        path: '*',
        lazy: () => import('@/routes/not-found'),
      },
    ],
  },
]);
