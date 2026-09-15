import { APP_NAME } from '@/lib/config/app';

/** 전역 푸터. 있는 정보만 적는다. 아직 없는 약관·고객센터 링크를 채워 넣지 않는다. */
export function AppFooter() {
  return (
    <footer className="border-t border-subtle">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-4 py-8 text-sm text-ink-muted md:flex-row md:items-center md:justify-between md:px-6">
        <p>{APP_NAME}</p>
        <p>분석 엔진 KataGo</p>
      </div>
    </footer>
  );
}
