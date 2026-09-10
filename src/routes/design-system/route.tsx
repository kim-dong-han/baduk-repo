import { ThemeToggle } from './theme-toggle';

/* ---------------------------------------------------------------------------
 * 참조 시트용 조각들.
 * 서비스 컴포넌트가 아니라 토큰을 눈으로 확인하기 위한 도구다.
 * ------------------------------------------------------------------------- */

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-subtle pt-8">
      <h2 className="text-2xl">{title}</h2>
      {note ? <p className="mt-2 max-w-prose text-ink-muted">{note}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Swatch({ token, label, textToken }: { token: string; label: string; textToken?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 rounded-md border border-subtle"
        style={{ backgroundColor: `var(${token})` }}
      >
        {textToken ? (
          <span
            className="flex h-full items-center justify-center text-sm"
            style={{ color: `var(${textToken})` }}
          >
            가나다 Ag
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-sm">{label}</p>
        <p className="font-mono text-xs text-ink-faint">{token}</p>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{children}</div>;
}

export function Component() {
  return (
    <main className="container-page py-12">
      {/* React 19 가 title/meta 를 <head> 로 올려준다. */}
      <title>디자인 토큰 · 바둑 AI 기보 분석</title>
      <meta name="robots" content="noindex" />

      <header className="flex flex-wrap items-start justify-between gap-6 pb-10">
        <div className="max-w-prose">
          <p className="label-text">참조 시트</p>
          <h1 className="mt-2 text-4xl">디자인 토큰</h1>
          <p className="mt-4 text-lg text-ink-muted">
            컴포넌트는 이 이름들만 쓴다. 색·크기·간격을 코드에 직접 적지 않는다. 값을 바꿀 일이
            생기면 <code className="font-mono text-base">src/styles/tokens.css</code> 한 곳만
            고친다.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex flex-col gap-12">
        {/* --- 색 ------------------------------------------------------------ */}
        <Section
          title="표면과 텍스트"
          note="배경은 순백이 아니라 따뜻한 종이색이다. 텍스트는 순검정이 아니라 먹빛이다. 두 극단을 피하면 화면이 오래 봐도 눈이 덜 피로하다."
        >
          <Row>
            <Swatch token="--surface-page" label="페이지 배경" textToken="--text-primary" />
            <Swatch token="--surface-raised" label="띄운 표면" textToken="--text-primary" />
            <Swatch token="--surface-sunken" label="가라앉은 표면" textToken="--text-primary" />
            <Swatch token="--text-primary" label="본문 · 15.9:1" textToken="--text-inverse" />
            <Swatch token="--text-secondary" label="보조 · 4.8:1" textToken="--text-inverse" />
          </Row>
        </Section>

        <Section
          title="동작과 상태"
          note="Primary 는 차분한 잉크빛 파랑이다. 상태색은 예약되어 있으며 차트 시리즈 색으로 재사용하지 않는다. 상태는 색만으로 알리지 않고 항상 아이콘이나 문구를 함께 붙인다."
        >
          <Row>
            <Swatch token="--accent" label="Primary" textToken="--accent-on" />
            <Swatch token="--success" label="Success" textToken="--accent-on" />
            <Swatch token="--warning" label="Warning (텍스트용)" textToken="--accent-on" />
            <Swatch token="--warning-icon" label="Warning (아이콘용)" textToken="--text-primary" />
            <Swatch token="--danger" label="Danger" textToken="--accent-on" />
          </Row>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              ['정보', '--info-surface', '--info-border', '--info'],
              ['정상', '--success-surface', '--success-border', '--success'],
              ['주의', '--warning-surface', '--warning-border', '--warning'],
              ['오류', '--danger-surface', '--danger-border', '--danger'],
            ].map(([label, bg, border, fg]) => (
              <span
                key={label}
                className="rounded-md border px-3 py-1.5 text-sm"
                style={{
                  backgroundColor: `var(${bg})`,
                  borderColor: `var(${border})`,
                  color: `var(${fg})`,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </Section>

        {/* --- 타이포 -------------------------------------------------------- */}
        <Section
          title="타이포그래피"
          note="한국어 가독성이 기준이다. 본문은 16px 아래로 내려가지 않고, 가장 작은 글자도 13px 이다. 행간은 라틴 기준보다 넉넉한 1.7 을 본문 기본으로 쓴다."
        >
          <div className="flex flex-col gap-6">
            {[
              ['text-5xl', '48px / 1.2', '흑이 우세합니다'],
              ['text-4xl', '36px / 1.2', '흑이 우세합니다'],
              ['text-3xl', '30px / 1.35', '기보 분석 결과'],
              ['text-2xl', '24px / 1.35', '수순별 승률 변화'],
              ['text-xl', '20px / 1.55', '이 수에서 승률이 크게 흔들렸다'],
              ['text-lg', '17px / 1.7', '상세 설명에 쓰는 조금 큰 본문이다'],
              ['text-base', '16px / 1.7', '본문 기본 크기다. 모든 설명은 여기서 시작한다'],
              ['text-sm', '14px / 1.6', '보조 정보. 메타데이터나 도움말에 쓴다'],
              ['text-xs', '13px / 1.55', '캡션과 좌표. 이보다 작은 글자는 만들지 않는다'],
            ].map(([cls, spec, sample]) => (
              <div key={cls} className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span className="w-24 shrink-0 font-mono text-xs text-ink-faint">{cls}</span>
                <span className="w-24 shrink-0 font-mono tabular text-xs text-ink-faint">
                  {spec}
                </span>
                <span className={cls}>{sample}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-baseline gap-6">
            <span className="text-lg">Regular 400</span>
            <span className="text-lg font-medium">Medium 500</span>
            <span className="text-lg font-semibold">Semibold 600</span>
            <span className="text-lg font-bold">Bold 700</span>
            <span className="font-mono tabular text-lg">120.5% · 3.5집 · 187수</span>
          </div>
        </Section>

        {/* --- 여백 ---------------------------------------------------------- */}
        <Section
          title="여백"
          note="4px 배수 사다리만 쓴다. 페이지마다 임의의 값을 새로 만들지 않는다. 영역을 나눌 때는 선이나 카드보다 여백을 먼저 쓴다."
        >
          <div className="flex flex-col gap-2">
            {[
              ['1', 4],
              ['2', 8],
              ['3', 12],
              ['4', 16],
              ['5', 20],
              ['6', 24],
              ['8', 32],
              ['10', 40],
              ['12', 48],
              ['16', 64],
              ['20', 80],
            ].map(([name, px]) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-16 shrink-0 font-mono text-xs text-ink-faint">{name}</span>
                <span className="w-14 shrink-0 font-mono tabular text-xs text-ink-faint">
                  {px}px
                </span>
                <span
                  className="h-3 rounded-xs bg-accent-subtle-border"
                  style={{ width: `${px}px` }}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* --- Radius / Shadow ----------------------------------------------- */}
        <div className="grid gap-12 lg:grid-cols-2">
          <Section
            title="모서리"
            note="8~16px 범위를 쓴다. 그보다 더 둥글게 만들지 않는다. 둥글수록 친근해 보이지만, 정보가 많은 화면에서는 경계가 흐려진다."
          >
            <div className="flex flex-wrap gap-4">
              {[
                ['rounded-xs', '4px'],
                ['rounded-sm', '6px'],
                ['rounded-md', '8px'],
                ['rounded-lg', '12px'],
                ['rounded-xl', '16px'],
              ].map(([cls, px]) => (
                <div key={cls} className="flex flex-col items-center gap-2">
                  <div className={`size-16 border border-line bg-sunken ${cls}`} />
                  <span className="font-mono text-xs text-ink-faint">{px}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="그림자"
            note="떠 있어야 하는 것에만 쓴다. 검정이 아니라 따뜻한 갈색을 깔아 종이 위 그림자처럼 보이게 한다."
          >
            <div className="flex flex-wrap gap-4">
              {[
                ['shadow-xs', '거의 없음'],
                ['shadow-sm', '기본'],
                ['shadow-md', '드롭다운'],
                ['shadow-lg', '모달'],
              ].map(([cls, use]) => (
                <div key={cls} className="flex flex-col items-center gap-2">
                  <div className={`size-16 rounded-md bg-raised ${cls}`} />
                  <span className="font-mono text-xs text-ink-faint">{use}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* --- 레이아웃 ------------------------------------------------------- */}
        <Section
          title="레이아웃"
          note="데스크톱 중심이고 상단 네비게이션을 쓴다. 왼쪽 고정 사이드바를 기본 구조로 만들지 않는다. 페이지마다 같은 3열 카드 대시보드를 반복하지 않는다."
        >
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['--layout-max', '1200px', '기본 콘텐츠 폭'],
              ['--layout-max-wide', '1280px', '바둑판 + 분석 패널'],
              ['--layout-max-prose', '720px', '읽기 위주의 글'],
              ['--layout-gutter', '24px', '데스크톱 좌우 여백'],
              ['--layout-nav-height', '64px', '상단 네비게이션'],
              ['--layout-section-gap', '64px', '섹션 사이'],
            ].map(([token, value, use]) => (
              <div key={token} className="border-l-2 border-subtle pl-4">
                <dt className="font-mono text-xs text-ink-faint">{token}</dt>
                <dd className="mt-1 tabular text-lg">{value}</dd>
                <dd className="text-sm text-ink-muted">{use}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* --- 바둑판 --------------------------------------------------------- */}
        <Section
          title="바둑판"
          note="바둑판은 카드 안에 든 작은 컴포넌트가 아니다. 분석 화면의 시각적 중심이며 자기 토큰 계열을 갖는다. 다크 모드에서도 판을 검게 만들지 않는다. 판이 어두워지면 흑돌이 묻혀 사라진다."
        >
          <div className="flex flex-wrap items-start gap-8">
            <div
              className="rounded-lg border p-4"
              style={{
                backgroundColor: 'var(--board-surface)',
                borderColor: 'var(--board-surface-edge)',
                boxShadow: 'var(--elevation-sm)',
              }}
            >
              <svg
                width="220"
                height="220"
                viewBox="0 0 220 220"
                role="img"
                aria-label="바둑판 예시"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <g key={i}>
                    <line
                      x1={20 + i * 30}
                      y1={20}
                      x2={20 + i * 30}
                      y2={200}
                      stroke="var(--board-line)"
                      strokeWidth="1"
                    />
                    <line
                      x1={20}
                      y1={20 + i * 30}
                      x2={200}
                      y2={20 + i * 30}
                      stroke="var(--board-line)"
                      strokeWidth="1"
                    />
                  </g>
                ))}
                <circle cx={110} cy={110} r={3} fill="var(--board-star)" />
                <circle
                  cx={80}
                  cy={80}
                  r={14}
                  fill="var(--stone-black)"
                  stroke="var(--stone-black-edge)"
                />
                <circle
                  cx={110}
                  cy={110}
                  r={14}
                  fill="var(--stone-white)"
                  stroke="var(--stone-white-edge)"
                />
                <circle
                  cx={140}
                  cy={80}
                  r={14}
                  fill="var(--stone-black)"
                  stroke="var(--board-last-move)"
                  strokeWidth="2.5"
                />
                <text
                  x={140}
                  y={85}
                  textAnchor="middle"
                  fontSize="13"
                  fill="var(--stone-label-on-black)"
                >
                  7
                </text>
              </svg>
            </div>

            <div className="max-w-prose">
              <h3 className="text-xl">기하 비율</h3>
              <p className="mt-2 text-ink-muted">
                판 크기는 화면에 따라 달라진다. 그래서 픽셀이 아니라 격자 간격에 곱하는 비율로 둔다.
                Canvas 렌더러는 이 값을 읽어 쓴다.
              </p>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                {[
                  ['--board-stone-size', '0.94', '돌 지름'],
                  ['--board-star-size', '0.11', '화점 지름'],
                  ['--board-line-width', '0.035', '격자선 두께'],
                  ['--board-padding', '0.85', '판 가장자리 여백'],
                  ['--board-coord-size', '0.42', '좌표 문자'],
                ].map(([token, value, use]) => (
                  <div key={token} className="contents">
                    <dt className="font-mono text-xs text-ink-faint">{token}</dt>
                    <dd className="tabular text-sm">
                      {value} <span className="text-ink-muted">— {use}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Section>

        {/* --- 분석 신호 ------------------------------------------------------ */}
        <Section
          title="수 품질"
          note="예약된 상태 색이다. 차트 시리즈 색으로 재사용하지 않는다. 색각 이상을 고려해 색만으로 구분하지 않고 항상 이름과 수치를 함께 보여준다."
        >
          <div className="flex flex-wrap gap-3">
            {[
              ['AI 최선', '--move-best', '--move-best-surface'],
              ['좋은 수', '--move-good', '--move-good-surface'],
              ['부정확', '--move-inaccuracy', '--move-inaccuracy-surface'],
              ['실수', '--move-mistake', '--move-mistake-surface'],
              ['대악수', '--move-blunder', '--move-blunder-surface'],
            ].map(([label, fg, bg]) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-md px-3 py-2"
                style={{ backgroundColor: `var(${bg})`, color: `var(${fg})` }}
              >
                <span className="size-2.5 rounded-full" style={{ backgroundColor: `var(${fg})` }} />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* --- 차트 ---------------------------------------------------------- */}
        <Section
          title="차트"
          note="시리즈 색은 1번부터 순서대로 배정하며 순환시키지 않는다. 8슬롯 모두 접근성 검증기를 통과했다(인접쌍 기준). 산점도처럼 아무 두 계열이나 나란히 놓이는 형태에서는 1·4·5번 세 개까지만 쓴다."
        >
          <div className="flex flex-col gap-8">
            <div>
              <p className="label-text">Categorical — 정체성(어느 계열인가)</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="flex flex-col gap-1.5">
                    <div
                      className="h-12 w-20 rounded-sm"
                      style={{ backgroundColor: `var(--series-${n})` }}
                    />
                    <span className="font-mono text-xs text-ink-faint">--series-{n}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="label-text">Sequential — 크기(얼마나 큰가)</p>
              <div className="mt-3 flex overflow-hidden rounded-sm">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-12 flex-1" style={{ background: `var(--seq-${n})` }} />
                ))}
              </div>
            </div>

            <div>
              <p className="label-text">Diverging — 극성(집 차이처럼 0 을 기준으로 갈리는 값)</p>
              <div className="mt-3 flex overflow-hidden rounded-sm">
                {['neg-3', 'neg-2', 'neg-1', 'mid', 'pos-1', 'pos-2', 'pos-3'].map((k) => (
                  <div key={k} className="h-12 flex-1" style={{ background: `var(--div-${k})` }} />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-ink-faint">
                <span>백 우세</span>
                <span>호각</span>
                <span>흑 우세</span>
              </div>
            </div>

            <div>
              <p className="label-text">승률 — 임의의 색을 입히지 않고 돌 색을 그대로 쓴다</p>
              <div className="mt-3 flex h-10 overflow-hidden rounded-sm">
                <div
                  className="flex items-center justify-center tabular text-xs"
                  style={{
                    width: '58%',
                    backgroundColor: 'var(--winrate-black)',
                    color: 'var(--stone-label-on-black)',
                  }}
                >
                  흑 58.0%
                </div>
                <div
                  className="flex items-center justify-center tabular text-xs"
                  style={{
                    width: '42%',
                    backgroundColor: 'var(--winrate-white)',
                    color: 'var(--stone-label-on-white)',
                  }}
                >
                  백 42.0%
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}

Component.displayName = 'DesignSystemRoute';
