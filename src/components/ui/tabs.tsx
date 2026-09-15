import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

/*
 * 탭. 동작(방향키 이동 · 선택 상태 · ARIA)은 Radix 가, 모양은 토큰이 담당한다.
 *
 * 카드나 알약 모양으로 만들지 않는다. 밑줄 하나로 현재 탭을 표시하고,
 * 선택된 탭은 글자 굵기와 색도 함께 바뀌어 색만으로 구분하지 않는다.
 *
 * Tabs · TabsList · TabsTrigger · TabsContent 는 함께 쓰는 한 벌이라 한 파일에 둔다.
 */

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: TabsPrimitive.TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn('flex flex-wrap gap-6 border-b border-line', className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        '-mb-px inline-flex h-11 shrink-0 items-center border-b-2 border-transparent text-base text-ink-muted',
        'transition-colors duration-150 hover:text-ink',
        'data-[state=active]:border-accent data-[state=active]:font-semibold data-[state=active]:text-ink-strong',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: TabsPrimitive.TabsContentProps) {
  return <TabsPrimitive.Content className={cn('pt-6', className)} {...props} />;
}
