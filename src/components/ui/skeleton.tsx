import { cn } from '@/lib/utils';

/**
 * 콘텐츠 자리표시자. 크기는 쓰는 쪽이 className 으로 실제 콘텐츠와 같게 맞춘다.
 * 장식이므로 스크린리더에서 숨긴다. 로딩 중이라는 사실은 감싸는 영역이 알린다.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-sm bg-subtle', className)} />;
}
