import { Link } from 'react-router';

/**
 * 초기 확인용 임시 화면.
 * 실제 랜딩은 Pages 단계에서 만든다.
 */
export function Component() {
  return (
    <main className="container-page flex min-h-dvh max-w-prose flex-col justify-center gap-6">
      <p className="label-text">바둑 AI 기보 분석</p>
      <h1 className="text-4xl">디자인 시스템까지 준비되었다.</h1>
      <p className="text-lg text-ink-muted">
        토큰과 기본 규칙이 자리를 잡았다. 화면 구현은 아직 시작하지 않았다.
      </p>
      <p>
        <Link
          to="/design-system"
          className="text-link underline decoration-line-strong underline-offset-4 hover:text-link-hover"
        >
          디자인 토큰 확인하기
        </Link>
      </p>
    </main>
  );
}

Component.displayName = 'HomeRoute';
