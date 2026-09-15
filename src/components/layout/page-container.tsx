import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * 페이지 본문의 폭과 바깥 여백.
 *
 * | size    | 최대 폭 | 쓰는 곳                        |
 * |---------|--------|--------------------------------|
 * | prose   | 720px  | 로그인, 소개처럼 읽기 위주      |
 * | content | 1200px | 목록, 리포트 (기본)             |
 * | wide    | 1280px | 바둑판과 분석 패널이 함께 있는 화면 |
 */
const pageContainerVariants = cva('mx-auto w-full px-4 md:px-6', {
  variants: {
    size: {
      prose: 'max-w-(--layout-max-prose)',
      content: 'max-w-content',
      wide: 'max-w-wide',
    },
    spacing: {
      default: 'py-10 md:py-12',
      compact: 'py-6',
      none: '',
    },
  },
  defaultVariants: {
    size: 'content',
    spacing: 'default',
  },
});

type PageContainerProps = React.ComponentProps<'div'> & VariantProps<typeof pageContainerVariants>;

export function PageContainer({ size, spacing, className, ...props }: PageContainerProps) {
  return <div className={cn(pageContainerVariants({ size, spacing }), className)} {...props} />;
}
