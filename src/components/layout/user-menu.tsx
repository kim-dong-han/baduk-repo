import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, LogOut } from 'lucide-react';

import type { HeaderUser } from './types';

type UserMenuProps = {
  user: HeaderUser;
  onSignOut: () => void;
};

/**
 * 로그인한 사용자 메뉴.
 * 키보드 조작(Enter · 방향키 · Esc)과 포커스 복귀는 Radix 가 처리한다.
 */
export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const initial = user.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={`${user.name} 계정 메뉴`}
        className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-ink transition-colors duration-150 hover:bg-sunken data-[state=open]:bg-sunken"
      >
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-full bg-accent-subtle text-sm font-semibold text-accent"
        >
          {initial}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">{user.name}</span>
        <ChevronDown aria-hidden="true" className="hidden size-4 text-ink-faint sm:block" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-(--z-dropdown) min-w-56 rounded-md border border-line bg-overlay p-1 text-ink shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-ink-strong">{user.name}</p>
            {user.email ? <p className="truncate text-xs text-ink-muted">{user.email}</p> : null}
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-subtle" />

          <DropdownMenu.Item
            onSelect={onSignOut}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-sm px-3 text-sm outline-none select-none data-highlighted:bg-sunken"
          >
            <LogOut aria-hidden="true" className="size-4 text-ink-muted" />
            로그아웃
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
