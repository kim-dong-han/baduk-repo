'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: '라이트', Icon: Sun },
  { value: 'dark', label: '다크', Icon: Moon },
  { value: 'system', label: '시스템', Icon: Monitor },
];

/**
 * 토큰 참조 시트에서 두 모드를 눈으로 확인하기 위한 도구다.
 * 실제 서비스용 테마 전환(초기 깜빡임 방지 스크립트, 저장 등)은
 * 헤더를 만들 때 components/layout 으로 옮겨 제대로 구현한다.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      role="radiogroup"
      aria-label="테마"
      className="inline-flex items-center gap-1 rounded-md border border-line bg-raised p-1"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(value)}
            className={[
              'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm transition-colors duration-150',
              selected
                ? 'bg-accent-subtle text-ink-strong'
                : 'text-ink-muted hover:bg-sunken hover:text-ink',
            ].join(' ')}
          >
            <Icon size={15} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
