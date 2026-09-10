import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 조건부 className 병합. Tailwind 클래스 충돌은 뒤에 온 것이 이긴다. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
