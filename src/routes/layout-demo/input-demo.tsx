import { Section } from '@/components/layout/section';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function InputDemo() {
  return (
    <Section
      title="입력"
      description="모든 입력에는 라벨이 붙습니다. 도움말과 오류는 입력칸과 연결되어 스크린리더가 함께 읽습니다."
    >
      <div className="grid max-w-(--layout-max-prose) gap-6 md:grid-cols-2">
        <Field label="기보 제목" hint="비워 두면 대국자 이름으로 채웁니다.">
          {(control) => <Input {...control} placeholder="예: 주말 리그 3국" />}
        </Field>

        <Field label="아이디" required error="아이디는 3자 이상이어야 합니다.">
          {(control) => <Input {...control} defaultValue="ab" autoComplete="username" />}
        </Field>

        <Field label="비밀번호" required>
          {(control) => <Input {...control} type="password" autoComplete="current-password" />}
        </Field>

        <Field label="분석 엔진" hint="서버 설정이라 바꿀 수 없습니다.">
          {(control) => <Input {...control} value="KataGo · visits 1000" disabled readOnly />}
        </Field>
      </div>
    </Section>
  );
}
