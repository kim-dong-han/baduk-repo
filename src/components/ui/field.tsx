import { useId } from 'react';
import { CircleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Field 가 입력 요소에 넘겨주는 접근성 속성. 그대로 펼쳐 넣으면 된다. */
export type FieldControlProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
};

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  /** 입력 요소를 그린다. React Hook Form 의 register 결과와 함께 펼쳐도 된다. */
  children: (control: FieldControlProps) => React.ReactNode;
};

/**
 * 라벨 · 도움말 · 오류를 입력 요소와 연결한다.
 *
 * ```tsx
 * <Field label="아이디" hint="영문과 숫자 3자 이상" error={errors.username?.message}>
 *   {(control) => <Input {...control} {...register('username')} />}
 * </Field>
 * ```
 *
 * 오류는 색만으로 알리지 않는다. 아이콘과 문장을 함께 보여준다.
 */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink-strong">
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        required,
      })}

      {hint ? (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
