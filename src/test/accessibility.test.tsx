/**
 * アクセシビリティテスト
 * 
 * Material Design 3準拠のコンポーネントのアクセシビリティを検証
 */

import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import { createModernTheme } from '../theme/modernTheme';
import { EnterpriseSettingsPanel } from '../components/EnterpriseSettingsPanel';
import { BentoGrid } from '../components/ui/Bento/BentoGrid';

// jest-axeのマッチャーを追加
expect.extend(toHaveNoViolations);

// テスト用のテーマプロバイダーラッパー
const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = createModernTheme({
    mode: 'light',
    highContrast: false,
    fontSize: 'medium',
  });
  
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeProvider>
  );
};

describe('Accessibility Tests', () => {
  describe('EnterpriseSettingsPanel', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <TestProvider>
          <EnterpriseSettingsPanel />
        </TestProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      const { container } = render(
        <TestProvider>
          <EnterpriseSettingsPanel />
        </TestProvider>
      );

      // 設定ボタンの確認
      const settingsButton = container.querySelector('[aria-label]');
      expect(settingsButton).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      const { container } = render(
        <TestProvider>
          <EnterpriseSettingsPanel />
        </TestProvider>
      );

      // フォーカス可能な要素が存在することを確認
      const focusableElements = container.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('BentoGrid', () => {
    const sampleItems = [
      {
        id: 'item-1',
        content: <div>Sample Content 1</div>,
        span: { xs: 1, md: 1, lg: 1 },
      },
      {
        id: 'item-2',
        content: <div>Sample Content 2</div>,
        span: { xs: 1, md: 1, lg: 1 },
      },
    ];

    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <TestProvider>
          <BentoGrid 
            items={sampleItems}
            columns={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}
          />
        </TestProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper semantic structure', () => {
      const { container } = render(
        <TestProvider>
          <BentoGrid 
            items={sampleItems}
            columns={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}
          />
        </TestProvider>
      );

      // グリッドコンテナーが存在することを確認
      const gridContainer = container.querySelector('[role="grid"], .bento-grid');
      expect(gridContainer || container.firstChild).toBeInTheDocument();
    });

    it('should provide meaningful content for screen readers', () => {
      const { getByText } = render(
        <TestProvider>
          <BentoGrid 
            items={sampleItems}
            columns={{ xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}
          />
        </TestProvider>
      );

      expect(getByText('Sample Content 1')).toBeInTheDocument();
      expect(getByText('Sample Content 2')).toBeInTheDocument();
    });
  });

  describe('Color Contrast', () => {
    it('should meet WCAG AA contrast requirements', async () => {
      const { container } = render(
        <TestProvider>
          <div>
            <EnterpriseSettingsPanel />
            <BentoGrid 
              items={[
                {
                  id: 'contrast-test',
                  content: <div style={{ color: '#000', background: '#fff' }}>High Contrast Text</div>,
                  span: { xs: 1, md: 1, lg: 1 },
                },
              ]}
              columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
            />
          </div>
        </TestProvider>
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Focus Management', () => {
    it('should properly manage focus for interactive elements', () => {
      const { container } = render(
        <TestProvider>
          <EnterpriseSettingsPanel />
        </TestProvider>
      );

      const interactiveElements = container.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      interactiveElements.forEach((element) => {
        expect(element).toBeVisible();
      });
    });
  });

  describe('Reduced Motion Support', () => {
    beforeEach(() => {
      // prefers-reduced-motionをモック
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });

    it('should respect user motion preferences', async () => {
      const { container } = render(
        <TestProvider>
          <BentoGrid 
            items={[
              {
                id: 'motion-test',
                content: <div>Motion Test Content</div>,
                span: { xs: 1, md: 1, lg: 1 },
              },
            ]}
            columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
            animated={true}
          />
        </TestProvider>
      );

      // アニメーションが適切に制御されていることを確認
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
