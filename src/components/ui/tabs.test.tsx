import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs', () => {
  it('방향키로 다음 탭을 선택한다', async () => {
    render(
      <Tabs defaultValue="summary">
        <TabsList aria-label="분석 결과 보기">
          <TabsTrigger value="summary">요약</TabsTrigger>
          <TabsTrigger value="moves">수순</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">요약 내용</TabsContent>
        <TabsContent value="moves">수순 내용</TabsContent>
      </Tabs>,
    );

    const summary = screen.getByRole('tab', { name: '요약' });
    expect(summary).toHaveAttribute('aria-selected', 'true');

    summary.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: '수순' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('수순 내용');
  });
});
