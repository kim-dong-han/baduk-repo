import Link from 'next/link';

/**
 * 초기 세팅 확인용 임시 화면.
 * 실제 랜딩/분석 화면은 별도 작업에서 구현한다.
 */
export default function HomePage() {
  return (
    <main className="container-page flex min-h-dvh max-w-prose flex-col justify-center gap-6">
      <p className="label-text">바둑 AI 기보 분석</p>
      <h1 className="text-4xl">디자인 시스템까지 준비되었다.</h1>
      <p className="text-lg text-ink-muted">
        토큰과 기본 규칙이 자리를 잡았다. 페이지 구현은 아직 시작하지 않았다.
      </p>
      <p>
        <Link
          href="/design-system"
          className="text-link underline decoration-line-strong underline-offset-4 hover:text-link-hover"
        >
          디자인 토큰 확인하기
        </Link>
      </p>
    </main>
  );
}
