import { cn } from '@/lib/utils';

const SIZE_CLASS = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
} as const;

type SpinnerProps = {
  size?: keyof typeof SIZE_CLASS;
  className?: string;
};

/**
 * 진행 중 표시. 장식이므로 스크린리더에서는 숨긴다.
 * 무엇을 기다리는지는 옆에 텍스트로 알린다(LoadingState · Button loading).
 * 색은 부모의 글자색을 따른다.
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('animate-spin', SIZE_CLASS[size], className)}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
