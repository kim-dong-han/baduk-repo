import { Compass } from 'lucide-react';
import { Link } from 'react-router';

import { PageContainer } from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button-variants';
import { EmptyState } from '@/components/ui/empty-state';

export function NotFoundPage() {
  return (
    <PageContainer size="prose">
      <title>페이지를 찾을 수 없음 · 바둑 AI 기보 분석</title>
      <EmptyState
        icon={<Compass />}
        title="아직 없는 화면입니다"
        description="주소가 바뀌었거나 아직 만들지 않은 화면입니다. 주요 메뉴의 화면은 순서대로 만들어집니다."
        action={
          <Link to="/" className={buttonVariants({ variant: 'secondary' })}>
            처음으로
          </Link>
        }
      />
    </PageContainer>
  );
}

// React Router 는 lazy 라우트에서 `Component` 를 찾는다.
export { NotFoundPage as Component };
