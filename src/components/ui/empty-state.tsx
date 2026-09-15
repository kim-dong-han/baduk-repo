import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  /** 왜 비어 있는지. 사용자가 무엇을 하면 채워지는지까지 쓴다. */
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** 다음 행동. 주요 동작은 하나만 둔다. */
  action?: React.ReactNode;
  className?: string;
};

/**
 * 데이터가 없을 때 보여주는 상태.
 *
 * 카드로 감싸지 않는다. 아이콘은 뜻을 보조할 뿐이라 배경 원 같은 장식을 붙이지 않는다.
 * 제목은 문서 구조상 제목이 아니므로 heading 태그를 쓰지 않는다.
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-16 text-center', className)}>
      {icon ? (
        <div aria-hidden="true" className="mb-4 text-ink-faint [&_svg]:size-8">
          {icon}
        </div>
      ) : null}
      <p className="text-xl font-semibold text-ink-strong">{title}</p>
      {description ? <p className="mt-2 max-w-prose text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
