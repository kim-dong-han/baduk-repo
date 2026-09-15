import { Outlet, ScrollRestoration, isRouteErrorResponse, useRouteError } from 'react-router';

import { AppLayout } from '@/components/layout/app-layout';
import { PageContainer } from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button-variants';
import { EmptyState } from '@/components/ui/empty-state';
import { useSessionStore } from '@/features/auth';
import { MAIN_NAV_ITEMS } from '@/lib/config/navigation';

/** 모든 화면이 공유하는 껍데기. 세션을 읽어 레이아웃에 넘기기만 한다. */
export function RootLayout() {
  const user = useSessionStore((state) => state.user);
  const signOut = useSessionStore((state) => state.signOut);

  return (
    <>
      <AppLayout navItems={MAIN_NAV_ITEMS} user={user} onSignOut={signOut}>
        <Outlet />
      </AppLayout>
      {/* 수순을 넘기다 뒤로 가기를 눌렀을 때 스크롤 위치가 튀지 않게 한다. */}
      <ScrollRestoration />
    </>
  );
}

// React Router 는 lazy 라우트에서 `Component` 를 찾는다.
export { RootLayout as Component };

/**
 * 라우트 트리 어디서 터져도 여기로 온다.
 * 레이아웃 자체가 원인일 수 있어 헤더 없이 단독으로 그린다.
 */
export function ErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : '화면을 그리는 중에 문제가 생겼습니다';

  const detail = isRouteErrorResponse(error)
    ? '요청한 화면을 찾지 못했습니다.'
    : error instanceof Error
      ? error.message
      : '알 수 없는 오류입니다.';

  return (
    <main>
      <PageContainer size="prose">
        <EmptyState
          title={title}
          description={detail}
          action={
            <a href="/" className={buttonVariants({ variant: 'secondary' })}>
              처음으로 돌아가기
            </a>
          }
        />
      </PageContainer>
    </main>
  );
}
