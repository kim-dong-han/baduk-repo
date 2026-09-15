import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';
import { IconButton } from './icon-button';

describe('Button', () => {
  it('기본 type 은 button 이다 (폼 안에서 의도치 않게 제출하지 않는다)', () => {
    render(<Button>저장</Button>);
    expect(screen.getByRole('button', { name: '저장' })).toHaveAttribute('type', 'button');
  });

  it('진행 중이면 누를 수 없고 진행 중임을 알린다', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        분석 요청
      </Button>,
    );

    const button = screen.getByRole('button', { name: '분석 요청' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('IconButton', () => {
  it('아이콘만 있어도 이름으로 찾을 수 있다', () => {
    render(<IconButton label="다음 수" icon={<svg />} />);
    expect(screen.getByRole('button', { name: '다음 수' })).toBeInTheDocument();
  });
});
