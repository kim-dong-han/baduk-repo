import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <main className="container-page flex min-h-dvh max-w-prose flex-col justify-center gap-4">
      <p className="label-text">404</p>
      <h1 className="text-3xl">없는 페이지다.</h1>
      <p className="text-ink-muted">주소를 다시 확인한다.</p>
      <p>
        <Link
          to="/"
          className="text-link underline decoration-line-strong underline-offset-4 hover:text-link-hover"
        >
          처음으로 돌아가기
        </Link>
      </p>
    </main>
  );
}

// React Router 는 lazy 라우트에서 `Component` 를 찾는다.
// 이름은 COMPONENT_RULES.md 대로 두고 별칭으로 규약을 맞춘다.
export { NotFoundPage as Component };
