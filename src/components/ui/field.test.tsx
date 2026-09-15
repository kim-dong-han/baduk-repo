import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Field } from './field';
import { Input } from './input';

describe('Field', () => {
  it('라벨로 입력칸을 찾을 수 있다', () => {
    render(<Field label="아이디">{(control) => <Input {...control} />}</Field>);
    expect(screen.getByLabelText('아이디')).toBeInstanceOf(HTMLInputElement);
  });

  it('도움말과 오류를 입력칸 설명으로 연결하고 오류 상태를 알린다', () => {
    render(
      <Field label="아이디" hint="영문과 숫자 3자 이상" error="너무 짧습니다">
        {(control) => <Input {...control} />}
      </Field>,
    );

    const input = screen.getByLabelText('아이디');
    expect(input).toHaveAccessibleDescription('영문과 숫자 3자 이상 너무 짧습니다');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('오류가 없으면 오류 상태를 붙이지 않는다', () => {
    render(<Field label="아이디">{(control) => <Input {...control} />}</Field>);
    expect(screen.getByLabelText('아이디')).not.toHaveAttribute('aria-invalid');
  });
});
