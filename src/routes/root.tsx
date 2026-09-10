import { Outlet, ScrollRestoration, isRouteErrorResponse, useRouteError } from 'react-router';

/**
 * 모든 화면이 공유하는 껍데기.
 *
 * 헤더·네비게이션은 아직 없다. PROJECT.md 의 순서대로
 * Design System 다음 단계인 Layout 에서 만든다.
 */
export function RootLayout() {
  return (
    <>
      <Outlet />
      {/* 수순을 넘기다 뒤로 가기를 눌렀을 때 스크롤 위치가 튀지 않게 한다. */}
      <ScrollRestoration />
    </>
  );
}

// React Router 는 lazy 라우트에서 `Component` 를 찾는다.
// 이름은 COMPONENT_RULES.md 대로 두고 별칭으로 규약을 맞춘다.
export { RootLayout as Component };

/** 라우트 트리 어디서 터져도 여기로 온다. */
export function ErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : '문제가 생겼다';

  const detail = isRouteErrorResponse(error)
    ? '요청한 화면을 찾지 못했다.'
    : error instanceof Error
      ? error.message
      : '알 수 없는 오류다.';

  return (
    <main className="container-page flex min-h-dvh max-w-prose flex-col justify-center gap-4">
      <p className="label-text">오류</p>
      <h1 className="text-3xl">{title}</h1>
      <p className="text-ink-muted">{detail}</p>
      <p>
        <a
          href="/"
          className="text-link underline decoration-line-strong underline-offset-4 hover:text-link-hover"
        >
          처음으로 돌아가기
        </a>
      </p>
    </main>
  );
}
