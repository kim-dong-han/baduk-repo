import { Section } from '@/components/layout/section';
import { LoadingState } from '@/components/ui/loading-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

/** 기보 목록 한 줄과 같은 모양의 자리표시자 */
function GameRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4">
      <Skeleton className="size-16 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="hidden h-9 w-24 md:block" />
    </div>
  );
}

export function LoadingDemo() {
  return (
    <Section
      title="로딩"
      description="모양을 알면 자리표시자를, 모르면 무엇을 기다리는지 문장으로 알립니다. 스피너만 덩그러니 두지 않습니다."
    >
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="label-text">자리표시자 — 기보 목록</p>
          <div
            role="status"
            aria-label="기보 목록을 불러오는 중"
            className="mt-3 divide-y divide-subtle"
          >
            <GameRowSkeleton />
            <GameRowSkeleton />
            <GameRowSkeleton />
          </div>
        </div>

        <div>
          <p className="label-text">영역 로딩</p>
          <div className="mt-3 border-y border-subtle">
            <LoadingState
              label="분석 결과를 불러오는 중"
              description="수가 많으면 몇 초 걸릴 수 있습니다."
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="label-text">스피너 크기</p>
        <div className="mt-3 flex items-center gap-6 text-ink-muted">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>
    </Section>
  );
}
