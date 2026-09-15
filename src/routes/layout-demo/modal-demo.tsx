import { useState } from 'react';

import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Modal, ModalClose } from '@/components/ui/modal';

/** 실제 API 대신 잠깐 기다리는 흉내만 낸다. */
const FAKE_DELAY_MS = 900;

export function ModalDemo() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleDelete() {
    setDeleting(true);
    window.setTimeout(() => {
      setDeleting(false);
      setDeleteOpen(false);
    }, FAKE_DELAY_MS);
  }

  return (
    <Section
      title="모달"
      description="Esc · 배경 클릭 · 닫기 버튼으로 닫히고, 닫히면 연 버튼으로 포커스가 돌아옵니다. 열려 있는 동안 포커스는 모달 안에 머뭅니다."
    >
      <div className="flex flex-wrap gap-3">
        <Modal
          trigger={<Button>정보 모달</Button>}
          title="집 손해란?"
          description="AI 최선수를 뒀을 때와 비교해 이 수로 잃은 집의 크기입니다."
          footer={
            <ModalClose asChild>
              <Button variant="primary">확인</Button>
            </ModalClose>
          }
        >
          <p>
            0.5집 미만이면 최선, 5집 이상이면 악수로 분류합니다. 등급은 색만이 아니라 이름과 수치로
            함께 표시됩니다.
          </p>
        </Modal>

        <Modal
          trigger={<Button>입력 모달</Button>}
          title="기보 정보 수정"
          size="lg"
          footer={
            <>
              <ModalClose asChild>
                <Button variant="ghost">취소</Button>
              </ModalClose>
              <ModalClose asChild>
                <Button variant="primary">저장</Button>
              </ModalClose>
            </>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="흑 대국자">
              {(control) => <Input {...control} defaultValue="김흑" />}
            </Field>
            <Field label="백 대국자">
              {(control) => <Input {...control} defaultValue="이백" />}
            </Field>
          </div>
        </Modal>

        <Modal
          open={deleteOpen}
          onOpenChange={(next) => {
            if (!deleting) setDeleteOpen(next);
          }}
          trigger={<Button variant="danger">확인 모달</Button>}
          title="이 기보를 삭제할까요?"
          description="분석 결과와 오답노트 기록도 함께 사라지며 되돌릴 수 없습니다."
          size="sm"
          hideCloseButton
          footer={
            <>
              <ModalClose asChild>
                <Button variant="ghost" disabled={deleting}>
                  취소
                </Button>
              </ModalClose>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>
                삭제
              </Button>
            </>
          }
        />
      </div>
    </Section>
  );
}
