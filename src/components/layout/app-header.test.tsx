import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import type { NavItem } from '@/lib/config/navigation';

import { AppHeader } from './app-header';

const NAV: NavItem[] = [
  { to: '/games', label: '내 기보' },
  { to: '/study', label: '분석판' },
];

function renderHeader(path: string, user: { name: string } | null) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppHeader navItems={NAV} user={user} onSignOut={vi.fn()} />
    </MemoryRouter>,
  );
}

describe('AppHeader', () => {
  it('현재 위치의 메뉴를 aria-current 로 알린다', () => {
    renderHeader('/study', null);
    const nav = screen.getByRole('navigation', { name: '주요 메뉴' });

    expect(nav.querySelector('a[href="/study"]')).toHaveAttribute('aria-current', 'page');
    expect(nav.querySelector('a[href="/games"]')).not.toHaveAttribute('aria-current');
  });

  it('로그인 전에는 로그인 링크를 보여준다', () => {
    renderHeader('/', null);
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /계정 메뉴/ })).not.toBeInTheDocument();
  });

  it('로그인 후에는 사용자 메뉴를 보여준다', () => {
    renderHeader('/', { name: '데모 사용자' });
    expect(screen.getByRole('button', { name: '데모 사용자 계정 메뉴' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '로그인' })).not.toBeInTheDocument();
  });

  it('좁은 화면용 메뉴 버튼에 이름이 있다', () => {
    renderHeader('/', null);
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toBeInTheDocument();
  });
});
