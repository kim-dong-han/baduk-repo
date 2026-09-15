import { Download, Pencil, SkipBack, SkipForward, Trash2, Upload } from 'lucide-react';

import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';

export function ButtonDemo() {
  return (
    <Section
      title="버튼"
      description="기본은 보조 버튼입니다. 파란 주요 버튼은 화면의 핵심 동작 하나에만 씁니다."
    >
      <div className="flex flex-col gap-8">
        <div>
          <p className="label-text">종류</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button variant="primary">
              <Upload aria-hidden="true" />
              기보 올리기
            </Button>
            <Button>수순 보기</Button>
            <Button variant="ghost">취소</Button>
            <Button variant="danger">
              <Trash2 aria-hidden="true" />
              삭제
            </Button>
          </div>
        </div>

        <div>
          <p className="label-text">크기</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button size="sm">작게 36px</Button>
            <Button size="md">기본 44px</Button>
            <Button size="lg">크게 48px</Button>
          </div>
        </div>

        <div>
          <p className="label-text">상태</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button variant="primary" loading>
              분석 요청 중
            </Button>
            <Button disabled>누를 수 없음</Button>
          </div>
        </div>

        <div>
          <p className="label-text">아이콘 버튼 — 이름(aria-label)이 필수입니다</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <IconButton label="이전 수" icon={<SkipBack />} variant="secondary" />
            <IconButton label="다음 수" icon={<SkipForward />} variant="secondary" />
            <IconButton label="메모 수정" icon={<Pencil />} />
            <IconButton label="SGF 내려받기" icon={<Download />} />
          </div>
        </div>
      </div>
    </Section>
  );
}
