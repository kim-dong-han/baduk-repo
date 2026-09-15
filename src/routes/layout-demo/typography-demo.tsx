import { Section } from '@/components/layout/section';

const SAMPLES = [
  { className: 'text-5xl font-semibold', spec: '40px · 페이지 제목 상한', text: '흑이 우세합니다' },
  { className: 'text-4xl font-semibold', spec: '32px · 페이지 제목', text: '기보 분석 결과' },
  { className: 'text-3xl font-semibold', spec: '28px · 섹션 제목 상한', text: '수순별 승률 변화' },
  {
    className: 'text-2xl font-semibold',
    spec: '24px · 섹션 제목',
    text: '이 수에서 승률이 흔들렸습니다',
  },
  { className: 'text-xl font-semibold', spec: '20px · 블록 제목', text: '실수로 기록된 수' },
  {
    className: 'text-lg',
    spec: '17px · 상세 본문',
    text: '백의 응수가 늦어 우변 흑 세력이 커졌습니다.',
  },
  {
    className: 'text-base',
    spec: '16px · 본문',
    text: '본문은 16px 에서 시작합니다. 한국어 문단은 행간 1.7 로 읽습니다.',
  },
  {
    className: 'text-sm text-ink-muted',
    spec: '14px · 보조 설명',
    text: '2026년 9월 11일 분석 · 214수',
  },
  { className: 'text-xs text-ink-muted', spec: '13px · 작은 메타', text: '좌표 Q16 · visits 1000' },
];

export function TypographyDemo() {
  return (
    <Section
      title="타이포그래피"
      description="제목은 크기뿐 아니라 굵기와 행간으로도 본문과 구분됩니다. 13px 보다 작은 글자는 없습니다."
    >
      <dl className="flex flex-col divide-y divide-subtle border-y border-subtle">
        {SAMPLES.map((sample) => (
          <div
            key={sample.spec}
            className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-8"
          >
            <dt className="shrink-0 tabular text-xs text-ink-faint md:w-48">{sample.spec}</dt>
            <dd className={sample.className}>{sample.text}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
