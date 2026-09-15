import { Section } from '@/components/layout/section';
import { cn } from '@/lib/utils';

const WIDTHS = [
  {
    label: 'prose · 720px',
    use: '로그인, 소개처럼 읽기 위주',
    className: 'max-w-(--layout-max-prose)',
  },
  { label: 'content · 1200px', use: '목록, 리포트 (기본)', className: 'max-w-content' },
  { label: 'wide · 1280px', use: '바둑판 + 분석 패널', className: 'max-w-wide' },
];

export function ContainerDemo() {
  return (
    <Section
      title="페이지 폭"
      description="레이아웃이 폭을 정하지 않습니다. 각 페이지가 목적에 맞는 폭을 고릅니다. 좁은 화면에서는 모두 화면 폭에 맞춰집니다."
    >
      <div className="flex flex-col gap-3">
        {WIDTHS.map((width) => (
          <div
            key={width.label}
            className={cn(
              'mx-auto w-full border-l-2 border-accent bg-accent-subtle px-4 py-3',
              width.className,
            )}
          >
            <p className="font-mono text-sm text-ink-strong">{width.label}</p>
            <p className="text-sm text-ink-muted">{width.use}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
