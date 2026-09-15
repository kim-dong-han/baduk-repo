import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { buttonVariants } from './button-variants';

const SQUARE_CLASS = {
  sm: 'size-9',
  md: 'size-11',
  lg: 'size-12',
} as const;

type IconButtonProps = Omit<React.ComponentProps<'button'>, 'children' | 'aria-label'> &
  Pick<VariantProps<typeof buttonVariants>, 'variant'> & {
    /**
     * 이 버튼이 하는 일. 스크린리더 이름과 툴팁에 쓰인다.
     * 아이콘만으로는 뜻을 전달할 수 없으므로 필수다.
     */
    label: string;
    icon: React.ReactNode;
    size?: keyof typeof SQUARE_CLASS;
  };

/** 아이콘만 있는 버튼. 글자를 함께 보여줄 수 있으면 Button 을 쓴다. */
export function IconButton({
  label,
  icon,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(buttonVariants({ variant, size }), SQUARE_CLASS[size], 'px-0', className)}
      {...props}
    >
      <span aria-hidden="true" className="contents">
        {icon}
      </span>
    </button>
  );
}
