import { FileUp, SearchX } from 'lucide-react';

import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export function EmptyDemo() {
  return (
    <Section
      title="빈 상태"
      description="왜 비었는지와 다음에 무엇을 하면 되는지를 함께 알립니다. 카드로 감싸지 않습니다."
    >
      <div className="grid gap-10 border-y border-subtle md:grid-cols-2 md:gap-0 md:divide-x md:divide-subtle">
        <EmptyState
          icon={<FileUp />}
          title="아직 올린 기보가 없습니다"
          description="SGF 나 GIB 파일을 올리면 AI 가 수마다 분석해 드립니다."
          action={<Button variant="primary">기보 올리기</Button>}
        />
        <EmptyState
          icon={<SearchX />}
          title="검색 결과가 없습니다"
          description="'주말 리그' 와 일치하는 기보가 없습니다. 대국자 이름이나 날짜로 다시 찾아보세요."
          action={<Button>검색어 지우기</Button>}
        />
      </div>
    </Section>
  );
}
