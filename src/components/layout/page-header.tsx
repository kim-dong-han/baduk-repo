import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  /** 제목 위의 짧은 분류 라벨 */
  eyebrow?: string;
  /** 오른쪽 동작 버튼 */
  actions?: React.ReactNode;
  className?: string;
};

/** 페이지 제목 영역. 한 페이지에 하나, 페이지의 유일한 h1 이다. */
export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}
    >
      <div className="max-w-(--layout-max-prose) min-w-0">
        {eyebrow ? <p className="label-text">{eyebrow}</p> : null}
        <h1 className={cn('text-4xl', eyebrow && 'mt-2')}>{title}</h1>
        {description ? <p className="mt-3 text-lg text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
