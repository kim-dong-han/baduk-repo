import { Section } from '@/components/layout/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TabsDemo() {
  return (
    <Section
      title="탭"
      description="같은 대상의 다른 관점을 전환할 때 씁니다. 탭에 포커스를 두고 방향키로 이동합니다."
    >
      <Tabs defaultValue="summary" className="max-w-(--layout-max-prose)">
        <TabsList aria-label="분석 결과 보기">
          <TabsTrigger value="summary">요약</TabsTrigger>
          <TabsTrigger value="moves">수순</TabsTrigger>
          <TabsTrigger value="notes">메모</TabsTrigger>
          <TabsTrigger value="compare" disabled>
            프로 비교
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <p>최종 형세는 흑 3.5집 우세. 승부의 분기점은 87수였습니다.</p>
        </TabsContent>
        <TabsContent value="moves">
          <p>214수 가운데 실수 6수, 악수 2수가 기록되었습니다.</p>
        </TabsContent>
        <TabsContent value="notes">
          <p className="text-ink-muted">아직 남긴 메모가 없습니다.</p>
        </TabsContent>
      </Tabs>
    </Section>
  );
}
