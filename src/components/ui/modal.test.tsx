import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from './button';
import { Modal } from './modal';

function renderModal() {
  render(
    <Modal
      trigger={<Button>열기</Button>}
      title="집 손해란?"
      description="최선수와 비교한 손해입니다."
    >
      <p>본문</p>
    </Modal>,
  );
}

describe('Modal', () => {
  it('제목을 이름으로 갖는 대화상자를 연다', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: '열기' }));

    const dialog = screen.getByRole('dialog', { name: '집 손해란?' });
    expect(dialog).toHaveAccessibleDescription('최선수와 비교한 손해입니다.');
  });

  it('Esc 로 닫히고 연 버튼으로 포커스가 돌아온다', async () => {
    renderModal();
    const trigger = screen.getByRole('button', { name: '열기' });

    await userEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('닫기 버튼으로 닫힌다', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: '열기' }));
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
