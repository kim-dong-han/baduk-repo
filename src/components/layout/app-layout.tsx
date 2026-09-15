import type { NavItem } from '@/lib/config/navigation';

import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';
import type { HeaderUser } from './types';

type AppLayoutProps = {
  navItems: NavItem[];
  user: HeaderUser | null;
  onSignOut: () => void;
  children: React.ReactNode;
};

/**
 * 모든 화면의 껍데기: 본문 건너뛰기 링크 · 헤더 · 본문 · 푸터.
 *
 * 본문 폭과 여백은 여기서 정하지 않는다. 화면마다 목적이 달라서
 * 각 페이지가 PageContainer 의 size 로 고른다(읽기 720 · 기본 1200 · 분석 1280).
 * 사이드바를 기본 구조로 두지 않는다.
 */
export function AppLayout({ navItems, user, onSignOut, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--z-toast) focus:rounded-md focus:bg-raised focus:px-4 focus:py-2 focus:shadow-md"
      >
        본문으로 건너뛰기
      </a>

      <AppHeader navItems={navItems} user={user} onSignOut={onSignOut} />

      <main id="main" className="flex-1">
        {children}
      </main>

      <AppFooter />
    </div>
  );
}
