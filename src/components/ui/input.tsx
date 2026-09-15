import { cn } from '@/lib/utils';

/**
 * 한 줄 입력.
 *
 * 글자 크기는 16px 이다. 16px 보다 작으면 iOS 가 입력할 때 화면을 확대한다.
 * 라벨은 이 컴포넌트가 아니라 Field 가 붙인다. placeholder 는 라벨이 아니다.
 */
export function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'h-11 w-full min-w-0 rounded-md border border-field-border bg-field px-3 text-base text-ink',
        'transition-colors duration-150',
        'placeholder:text-field-placeholder',
        'hover:border-field-border-hover focus-visible:border-focus',
        'aria-invalid:border-danger',
        'disabled:cursor-not-allowed disabled:bg-field-disabled disabled:text-ink-faint',
        className,
      )}
      {...props}
    />
  );
}
