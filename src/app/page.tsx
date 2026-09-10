/**
 * 초기 세팅 확인용 임시 화면.
 * 실제 랜딩/분석 화면은 별도 작업에서 구현한다.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-accent uppercase">setup complete</p>
      <h1 className="text-3xl font-semibold tracking-tight text-balance">바둑 AI 기보 분석</h1>
      <p className="leading-relaxed text-muted-foreground">
        프로젝트 기반 설정이 끝났다. 화면 구현은 아직 시작하지 않았다.
      </p>
      <div
        aria-hidden
        className="mt-2 h-24 w-24 rounded-md border border-board-surface-edge bg-board-surface"
      />
    </main>
  );
}
