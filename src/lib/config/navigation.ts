/**
 * 상단 주요 메뉴.
 *
 * 메뉴는 짧고 적게 유지한다. 새 화면이 생겨도 여기에 무조건 넣지 않고,
 * 사용자가 자주 오가는 곳만 올린다. 아직 없는 화면은 404 로 연결된다.
 */
export type NavItem = {
  to: string;
  label: string;
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { to: '/games', label: '내 기보' },
  { to: '/study', label: '분석판' },
  { to: '/play', label: 'AI 대국' },
  { to: '/notes', label: '오답노트' },
  { to: '/report', label: '실력 리포트' },
];
