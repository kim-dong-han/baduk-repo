import { NavLink } from 'react-router';

import type { NavItem } from '@/lib/config/navigation';
import { cn } from '@/lib/utils';

type MainNavProps = {
  items: NavItem[];
  className?: string;
};

/**
 * 데스크톱 상단 메뉴.
 * 현재 메뉴는 밑줄 + 굵기 + 색으로 함께 표시한다(색만으로 구분하지 않음).
 * 스크린리더에는 NavLink 가 aria-current="page" 로 알린다.
 */
export function MainNav({ items, className }: MainNavProps) {
  return (
    <nav aria-label="주요 메뉴" className={className}>
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative inline-flex h-(--layout-nav-height) items-center px-3 text-base whitespace-nowrap transition-colors duration-150',
                  'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full',
                  isActive
                    ? 'font-semibold text-ink-strong after:bg-accent'
                    : 'text-ink-muted after:bg-transparent hover:text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
