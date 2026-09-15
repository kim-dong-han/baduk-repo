import { useMemo, useState } from 'react';

import { Board, pointKey, pointToGtp, type Point, type Stone } from '@/components/board';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import {
  SAMPLE_CANDIDATES,
  SAMPLE_LAST_MOVE,
  SAMPLE_MARKERS,
  SAMPLE_STONES,
  SAMPLE_VARIATION,
  createSampleTerritory,
} from './sample-position';

type Toggle = {
  key: string;
  label: string;
  on: boolean;
  set: (next: boolean) => void;
};

/**
 * 바둑판 확인용 임시 화면. 실제 분석 화면이 생기면 지운다.
 * 판에 넘기는 데이터는 전부 이 파일이 들고 있다. Board 는 그리기만 한다.
 */
export function BoardDemoPage() {
  const [showMoveNumbers, setShowMoveNumbers] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showCandidates, setShowCandidates] = useState(true);
  const [showVariation, setShowVariation] = useState(false);
  const [showTerritory, setShowTerritory] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);

  /** 직접 놓아 보는 돌. 규칙 판단은 하지 않는다(따냄 없음). */
  const [placed, setPlaced] = useState<Stone[]>([]);
  const [hovered, setHovered] = useState<Point | null>(null);

  const territory = useMemo(() => createSampleTerritory(), []);

  const stones = useMemo(() => [...SAMPLE_STONES, ...placed], [placed]);
  const lastMove = placed.length ? placed[placed.length - 1]!.point : SAMPLE_LAST_MOVE;
  const nextColor = (SAMPLE_STONES.length + placed.length) % 2 === 0 ? 'B' : 'W';

  function handlePointClick(point: Point) {
    const taken = new Set(stones.map((stone) => pointKey(stone.point)));
    if (taken.has(pointKey(point))) return;
    setPlaced((prev) => [
      ...prev,
      { point, color: nextColor, moveNumber: SAMPLE_STONES.length + prev.length + 1 },
    ]);
  }

  const toggles: Toggle[] = [
    { key: 'numbers', label: '수순 번호', on: showMoveNumbers, set: setShowMoveNumbers },
    { key: 'coords', label: '좌표', on: showCoordinates, set: setShowCoordinates },
    { key: 'candidates', label: 'AI 추천수', on: showCandidates, set: setShowCandidates },
    { key: 'variation', label: '변화도', on: showVariation, set: setShowVariation },
    { key: 'territory', label: '집 예측', on: showTerritory, set: setShowTerritory },
    { key: 'markers', label: '표식', on: showMarkers, set: setShowMarkers },
  ];

  return (
    <PageContainer size="wide">
      <title>바둑판 데모 · 바둑 AI 기보 분석</title>
      <meta name="robots" content="noindex" />

      <PageHeader
        eyebrow="임시 데모"
        title="바둑판"
        description="판에 그릴 데이터를 모두 이 화면이 넘겨 줍니다. 판은 그리고 알리기만 하며 규칙을 판단하지 않습니다."
        actions={<ThemeToggle />}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Board
          size={19}
          stones={stones}
          lastMove={lastMove}
          markers={showMarkers ? SAMPLE_MARKERS : undefined}
          candidates={showCandidates ? SAMPLE_CANDIDATES : undefined}
          variation={showVariation ? SAMPLE_VARIATION : null}
          territory={showTerritory ? territory : null}
          showMoveNumbers={showMoveNumbers}
          showCoordinates={showCoordinates}
          interactive
          hoverColor={nextColor}
          onPointClick={handlePointClick}
          onPointHover={setHovered}
        />

        <div className="flex flex-col gap-8">
          <Section title="표시" headingLevel={3}>
            <div className="flex flex-wrap gap-2">
              {toggles.map((toggle) => (
                <Button
                  key={toggle.key}
                  size="sm"
                  variant={toggle.on ? 'primary' : 'secondary'}
                  aria-pressed={toggle.on}
                  onClick={() => toggle.set(!toggle.on)}
                >
                  {toggle.label}
                </Button>
              ))}
            </div>
          </Section>

          <Section title="상태" headingLevel={3}>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">마우스</dt>
                <dd className="tabular">{hovered ? pointToGtp(hovered) : '판 밖'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">다음 차례</dt>
                <dd>{nextColor === 'B' ? '흑' : '백'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">놓은 돌</dt>
                <dd className="tabular">{placed.length}개</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">마지막 수</dt>
                <dd className="tabular">{pointToGtp(lastMove)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-ink-muted">
              판을 누르면 돌이 놓입니다. 판에 포커스를 두고 방향키로 옮긴 뒤 Enter 로도 놓을 수
              있습니다.
            </p>
            <Button
              className="mt-4"
              size="sm"
              disabled={placed.length === 0}
              onClick={() => setPlaced([])}
            >
              놓은 돌 지우기
            </Button>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
}

// React Router 는 lazy 라우트에서 `Component` 를 찾는다.
export { BoardDemoPage as Component };
