import { Link } from 'react-router';

import { buttonVariants } from '@/components/ui/button-variants';
import type { NavItem } from '@/lib/config/navigation';

import { Brand } from './brand';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';
import type { HeaderUser } from './types';
import { UserMenu } from './user-menu';

type AppHeaderProps = {
  navItems: NavItem[];
  user: HeaderUser | null;
  onSignOut: () => void;
};

/**
 * 전역 헤더. 왼쪽 서비스 이름 · 가운데 주요 메뉴 · 오른쪽 로그인/사용자 메뉴.
 *
 * 양옆 영역을 같은 비율(flex-1)로 두어 메뉴가 화면 정가운데에 온다.
 * 배경은 불투명한 페이지색이다. 유리 효과를 쓰지 않는다.
 * 768px 미만에서는 가운데 메뉴를 숨기고 메뉴 버튼으로 연다.
 */
export function AppHeader({ navItems, user, onSignOut }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-(--z-nav) border-b border-subtle bg-page">
      <div className="mx-auto flex h-(--layout-nav-height) max-w-content items-center gap-6 px-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <Brand />
        </div>

        <MainNav items={navItems} className="hidden md:block" />

        <div className="flex flex-1 items-center justify-end gap-2">
          {user ? (
            <UserMenu user={user} onSignOut={onSignOut} />
          ) : (
            <Link
              to="/login"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'hidden md:inline-flex',
              })}
            >
              로그인
            </Link>
          )}
          <MobileNav items={navItems} user={user} onSignOut={onSignOut} className="md:hidden" />
        </div>
      </div>
    </header>
  );
}
