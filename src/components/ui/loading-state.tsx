import { cn } from '@/lib/utils';

import { Spinner } from './spinner';

type LoadingStateProps = {
  /** 무엇을 기다리는지. "불러오는 중" 보다 구체적으로 쓴다. 예: "기보를 불러오는 중" */
  label?: string;
  description?: string;
  className?: string;
};

/**
 * 영역 하나가 데이터를 기다리는 중임을 알린다.
 *
 * 레이아웃 모양을 알고 있으면 Skeleton 을 먼저 고려한다. 로드가 끝날 때 화면이 튀지 않는다.
 * 이 컴포넌트는 모양을 예측할 수 없을 때(처음 여는 분석 결과 등) 쓴다.
 */
export function LoadingState({ label = '불러오는 중', description, className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
    >
      <Spinner size="lg" className="text-ink-faint" />
      <p className="mt-4 text-base text-ink">{label}</p>
      {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
    </div>
  );
}
