import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { IconButton } from './icon-button';

const SIZE_CLASS = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
} as const;

type ModalProps = {
  title: string;
  description?: string;
  size?: keyof typeof SIZE_CLASS;
  /** 모달을 여는 요소. 없으면 open/onOpenChange 로 바깥에서 연다. */
  trigger?: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 하단 동작 버튼. 주요 동작을 오른쪽 끝에 둔다. */
  footer?: React.ReactNode;
  /** 오른쪽 위 닫기 버튼을 숨긴다. footer 에 다른 닫기 수단이 있을 때만 쓴다. */
  hideCloseButton?: boolean;
  children?: React.ReactNode;
};

/**
 * 모달.
 *
 * 포커스 가두기 · Esc 닫기 · 배경 클릭 닫기 · 닫은 뒤 원래 버튼으로 포커스 복귀 ·
 * 뒤 화면 스크롤 잠금은 Radix 가 처리한다.
 *
 * 모달은 보여주고 입력받는 일만 한다. 확인을 눌렀을 때 무엇을 할지(API 호출 등)는
 * 모달을 쓰는 쪽이 정한다. (COMPONENT_RULES.md 10절)
 */
export function Modal({
  title,
  description,
  size = 'md',
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  footer,
  hideCloseButton = false,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}

      <Dialog.Portal>
        {/* 배경이 스크롤 영역을 겸한다. 모달이 화면보다 길면 배경째 스크롤된다. */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-(--z-modal) grid place-items-center overflow-y-auto bg-scrim p-4',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            'duration-150',
          )}
        >
          <Dialog.Content
            className={cn(
              'flex w-full flex-col rounded-xl bg-overlay text-ink shadow-lg',
              'data-[state=open]:animate-in data-[state=open]:zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:zoom-out-95',
              'duration-150',
              SIZE_CLASS[size],
            )}
            {...(description ? {} : { 'aria-describedby': undefined })}
          >
            <div className="flex items-start gap-4 px-6 pt-6">
              <div className="min-w-0 flex-1">
                <Dialog.Title className="text-xl font-semibold text-ink-strong">
                  {title}
                </Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-2 text-ink-muted">
                    {description}
                  </Dialog.Description>
                ) : null}
              </div>

              {hideCloseButton ? null : (
                <Dialog.Close asChild>
                  <IconButton label="닫기" icon={<X />} size="sm" className="-mt-1 -mr-2" />
                </Dialog.Close>
              )}
            </div>

            {children ? <div className="px-6 pt-4 pb-6">{children}</div> : <div className="pb-6" />}

            {footer ? (
              <div className="flex flex-wrap justify-end gap-3 border-t border-subtle px-6 py-4">
                {footer}
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** footer 의 "취소" 처럼 모달을 닫기만 하는 버튼을 감싼다. */
export const ModalClose = Dialog.Close;
