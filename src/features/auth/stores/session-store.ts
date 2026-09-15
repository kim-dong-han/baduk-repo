import { create } from 'zustand';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type SessionState = {
  user: SessionUser | null;
  signInAsDemo: () => void;
  signOut: () => void;
};

/**
 * 목 세션.
 *
 * 레이아웃 단계에서 헤더의 로그인 전/후 모습을 확인하기 위한 임시 상태다.
 * 실제 인증(PROJECT.md 8단계, JWT)을 붙일 때 이 파일을 교체한다.
 */
const DEMO_USER: SessionUser = {
  id: 'demo',
  name: '데모 사용자',
  email: 'demo@example.com',
};

export const useSessionStore = create<SessionState>()((set) => ({
  user: DEMO_USER,
  signInAsDemo: () => set({ user: DEMO_USER }),
  signOut: () => set({ user: null }),
}));
