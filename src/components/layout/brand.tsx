import { Link } from 'react-router';

import { APP_NAME } from '@/lib/config/app';

/** 흑돌과 백돌이 맞닿은 표식. 색은 바둑판 토큰에서 온다. */
function BrandMark() {
  return (
    <svg viewBox="0 0 28 20" aria-hidden="true" className="h-5 w-7">
      <circle cx="18" cy="10" r="8.5" fill="var(--stone-white)" stroke="var(--stone-white-edge)" />
      <circle cx="10" cy="10" r="8.5" fill="var(--stone-black)" stroke="var(--stone-black-edge)" />
    </svg>
  );
}

export function Brand() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3 text-base font-semibold whitespace-nowrap text-ink-strong"
    >
      <BrandMark />
      {APP_NAME}
    </Link>
  );
}
