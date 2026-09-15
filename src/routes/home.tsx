import { Link } from 'react-router';

import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { buttonVariants } from '@/components/ui/button-variants';

/**
 * 임시 첫 화면. 실제 홈은 Pages 단계에서 만든다.
 */
export function HomePage() {
  return (
    <PageContainer size="prose">
      <PageHeader
        eyebrow="준비 중"
        title="공통 레이아웃까지 준비되었습니다"
        description="디자인 토큰과 공통 레이아웃이 자리를 잡았습니다. 각 화면은 아직 만들지 않았습니다."
      />
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/layout-demo" className={buttonVariants({ variant: 'primary' })}>
          레이아웃 데모 보기
        </Link>
        <Link to="/board-demo" className={buttonVariants({ variant: 'secondary' })}>
          바둑판 데모 보기
        </Link>
        <Link to="/design-system" className={buttonVariants({ variant: 'secondary' })}>
          디자인 토큰 보기
        </Link>
      </div>
    </PageContainer>
  );
}

// React Router 는 lazy 라우트에서 `Component` 를 찾는다.
export { HomePage as Component };
