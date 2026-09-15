import { useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';

type Theme = 'system' | 'light' | 'dark';

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: '라이트', Icon: Sun },
  { value: 'dark', label: '다크', Icon: Moon },
  { value: 'system', label: '시스템', Icon: Monitor },
];

function readTheme(): Theme {
  const value = document.documentElement.getAttribute('data-theme');
  return value === 'light' || value === 'dark' ? value : 'system';
}

/**
 * 라이트 / 다크 / 시스템 전환.
 *
 * 지금은 화면 확인용이라 선택을 저장하지 않는다(새로고침하면 시스템 설정으로 돌아간다).
 * 서비스용으로 쓸 때 첫 화면 깜빡임 방지와 저장을 함께 붙인다.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  function select(next: Theme) {
    const root = document.documentElement;
    if (next === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', next);
    setTheme(next);
  }

  return (
    <div
      role="group"
      aria-label="화면 테마"
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-line bg-raised p-1',
        className,
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            onClick={() => select(value)}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-sm px-3 text-sm transition-colors duration-150',
              selected
                ? 'bg-accent-subtle font-medium text-ink-strong'
                : 'text-ink-muted hover:bg-sunken hover:text-ink',
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
