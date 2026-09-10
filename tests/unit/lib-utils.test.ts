import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn', () => {
  it('falsy 값을 걸러낸다', () => {
    const isActive = false;
    expect(cn('a', isActive && 'b', undefined, 'c')).toBe('a c');
  });

  it('Tailwind 클래스 충돌은 뒤에 온 것이 이긴다', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});
