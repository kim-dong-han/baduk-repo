import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { LogOut, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router';

import { buttonVariants } from '@/components/ui/button-variants';
import { IconButton } from '@/components/ui/icon-button';
import type { NavItem } from '@/lib/config/navigation';
import { cn } from '@/lib/utils';

import { Brand } from './brand';
import type { HeaderUser } from './types';

type MobileNavProps = {
  items: NavItem[];
  user: HeaderUser | null;
  onSignOut: () => void;
  className?: string;
};

/**
 * 좁은 화면의 메뉴. 위에서 내려오는 패널이다.
 * 열려 있는 동안 포커스를 패널 안에 가두고 Esc 로 닫는다(Radix Dialog).
 * 메뉴를 고르면 닫힌다.
 */
export function MobileNav({ items, user, onSignOut, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton label="메뉴 열기" icon={<Menu />} className={className} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-modal) bg-scrim data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-0 z-(--z-modal) border-b border-line bg-page shadow-lg data-[state=open]:animate-in data-[state=open]:slide-in-from-top-4"
        >
          <Dialog.Title className="sr-only">메뉴</Dialog.Title>

          <div className="flex h-(--layout-nav-height) items-center justify-between px-4">
            <Brand />
            <Dialog.Close asChild>
              <IconButton label="메뉴 닫기" icon={<X />} />
            </Dialog.Close>
          </div>

          <nav aria-label="주요 메뉴" className="px-4 pb-4">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={close}
                    className={({ isActive }) =>
                      cn(
                        'flex h-12 items-center border-l-2 pl-4 text-lg',
                        isActive
                          ? 'border-accent font-semibold text-ink-strong'
                          : 'border-transparent text-ink-muted',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-subtle px-4 py-4">
            {user ? (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-ink-strong">{user.name}</p>
                  {user.email ? (
                    <p className="truncate text-sm text-ink-muted">{user.email}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    close();
                  }}
                  className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                >
                  <LogOut aria-hidden="true" />
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={close}
                className={buttonVariants({ variant: 'primary', fullWidth: true })}
              >
                로그인
              </Link>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
