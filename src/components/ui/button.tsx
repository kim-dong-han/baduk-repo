import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { buttonVariants } from './button-variants';
import { Spinner } from './spinner';

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** 진행 중이면 스피너를 붙이고 누를 수 없게 한다. 글자는 그대로 둬 폭이 흔들리지 않는다. */
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
}
