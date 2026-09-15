import { useId } from 'react';

import { cn } from '@/lib/utils';

type SectionProps = Omit<React.ComponentProps<'section'>, 'title'> & {
  title?: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** 위쪽 구분선. 여백만으로 나뉘지 않을 때만 쓴다. */
  divided?: boolean;
  /** 페이지 제목(h1) 바로 아래면 2, 섹션 안의 소단락이면 3 */
  headingLevel?: 2 | 3;
};

/**
 * 페이지 안의 한 덩어리.
 *
 * 카드로 감싸지 않는다. 섹션끼리는 여백(gap-16 = 64px)으로 먼저 나누고,
 * 그래도 경계가 필요할 때만 divided 로 선을 긋는다.
 */
export function Section({
  title,
  description,
  actions,
  divided = false,
  headingLevel = 2,
  className,
  children,
  ...props
}: SectionProps) {
  const headingId = useId();
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn(divided && 'border-t border-subtle pt-10', className)}
      {...props}
    >
      {title ? (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-(--layout-max-prose) min-w-0">
            <Heading id={headingId} className={headingLevel === 2 ? 'text-2xl' : 'text-xl'}>
              {title}
            </Heading>
            {description ? <p className="mt-2 text-ink-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
