import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/features/auth';

export function HeaderDemo() {
  const user = useSessionStore((state) => state.user);
  const signInAsDemo = useSessionStore((state) => state.signInAsDemo);
  const signOut = useSessionStore((state) => state.signOut);

  return (
    <Section
      title="헤더와 메뉴"
      description="왼쪽 서비스 이름, 가운데 주요 메뉴, 오른쪽 로그인 또는 사용자 메뉴. 768px 보다 좁으면 메뉴가 오른쪽 버튼 안으로 들어갑니다."
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>
          지금 헤더는{' '}
          <strong className="font-semibold text-ink-strong">
            {user ? `로그인 상태 (${user.name})` : '로그아웃 상태'}
          </strong>
          입니다. 목 세션이라 새로고침하면 로그인 상태로 돌아갑니다.
        </p>
        <div className="flex gap-3">
          <Button onClick={signInAsDemo} disabled={Boolean(user)}>
            로그인 상태로
          </Button>
          <Button onClick={signOut} disabled={!user}>
            로그아웃 상태로
          </Button>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-muted">
        주요 메뉴의 화면은 아직 없어 누르면 안내 화면이 나옵니다. 메뉴의 현재 위치 표시는 밑줄 ·
        굵기 · 색이 함께 바뀝니다.
      </p>
    </Section>
  );
}
