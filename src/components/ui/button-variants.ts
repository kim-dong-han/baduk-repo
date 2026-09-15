import { cva } from 'class-variance-authority';

/**
 * 버튼 모양. Link 를 버튼처럼 보이게 할 때도 이 함수를 쓴다.
 *
 * - 기본은 secondary 다. primary(accent)는 화면의 주요 동작 하나에만 쓴다.
 *   한 화면에 primary 가 여러 개면 무엇을 눌러야 할지 흐려진다.
 * - 높이 36 / 44 / 48px. 44px 는 터치 대상 최소 크기다.
 */
export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none',
    'transition-colors duration-150 ease-out',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-on hover:bg-accent-hover active:bg-accent-active',
        secondary: 'border border-line bg-raised text-ink hover:border-line-strong hover:bg-sunken',
        ghost: 'text-ink-muted hover:bg-sunken hover:text-ink',
        danger: 'bg-danger text-accent-on hover:bg-danger-hover',
      },
      size: {
        sm: 'h-9 px-3 text-sm [&_svg]:size-4',
        md: 'h-11 px-4 text-base [&_svg]:size-5',
        lg: 'h-12 px-6 text-lg [&_svg]:size-5',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
);
