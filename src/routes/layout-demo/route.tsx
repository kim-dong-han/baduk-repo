import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import { ButtonDemo } from './button-demo';
import { ContainerDemo } from './container-demo';
import { EmptyDemo } from './empty-demo';
import { HeaderDemo } from './header-demo';
import { InputDemo } from './input-demo';
import { LoadingDemo } from './loading-demo';
import { ModalDemo } from './modal-demo';
import { TabsDemo } from './tabs-demo';
import { TypographyDemo } from './typography-demo';

/**
 * 공통 레이아웃 확인용 임시 화면. 실제 서비스 화면이 생기면 지운다.
 * Page 는 배치만 한다(COMPONENT_RULES.md 3절). 각 섹션은 옆 파일에 있다.
 */
export function LayoutDemoPage() {
  return (
    <PageContainer>
      <title>레이아웃 데모 · 바둑 AI 기보 분석</title>
      <meta name="robots" content="noindex" />

      <PageHeader
        eyebrow="임시 데모"
        title="공통 레이아웃"
        description="모든 화면이 함께 쓰는 헤더, 페이지 폭, 섹션과 기본 컴포넌트를 한곳에서 확인합니다. API 는 연결하지 않았습니다."
        actions={<ThemeToggle />}
      />

      <div className="mt-16 flex flex-col gap-16">
        <HeaderDemo />
        <TypographyDemo />
        <ButtonDemo />
        <InputDemo />
        <TabsDemo />
        <ModalDemo />
        <LoadingDemo />
        <EmptyDemo />
        <ContainerDemo />
      </div>
    </PageContainer>
  );
}

// React Router 는 lazy 라우트에서 `Component` 를 찾는다.
export { LayoutDemoPage as Component };
