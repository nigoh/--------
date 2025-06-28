import type { Meta, StoryObj } from '@storybook/react';
import { EnterpriseSettingsPanel } from './EnterpriseSettingsPanel';

/**
 * Enterprise Settings Panel
 * 
 * Material Design 3準拠の設定パネルコンポーネント
 * テーマの動的切り替え、アクセシビリティ設定、フォントサイズ調整機能を提供
 */
const meta: Meta<typeof EnterpriseSettingsPanel> = {
  title: 'Components/Enterprise/EnterpriseSettingsPanel',
  component: EnterpriseSettingsPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Enterprise Settings Panel

Material Design 3の設計原則に基づいた高度な設定パネルコンポーネントです。

#### 特徴
- **テーマ切り替え**: ライト/ダークモードの動的切り替え
- **アクセシビリティ**: 高コントラストモード、フォントサイズ調整
- **レスポンシブデザイン**: モバイル/デスクトップ対応
- **Glassmorphism**: 現代的なガラス効果UI
- **アニメーション**: Framer Motion による滑らかなアニメーション

#### Material Design 3 対応
- Color System (Dynamic Color)
- Typography Scale
- Shape System  
- Elevation System
- Motion System

#### アクセシビリティ
- WCAG 2.2 準拠
- キーボードナビゲーション
- スクリーンリーダー対応
- Reduced Motion 対応
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-visible', 
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // このコンポーネントは props を受け取らないため、空の argTypes
  },
  args: {
    // デフォルトの args
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの設定パネル
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'デフォルトの設定パネル。右上の設定ボタンをクリックして開きます。',
      },
    },
  },
};

/**
 * ライトテーマ
 */
export const LightTheme: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'ライトテーマでの表示例。清潔で読みやすいインターフェースを提供します。',
      },
    },
  },
};

/**
 * ダークテーマ
 */
export const DarkTheme: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'ダークテーマでの表示例。暗い環境での視認性を向上させます。',
      },
    },
  },
};

/**
 * グラディエント背景
 */
export const GradientBackground: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'gradient' },
    docs: {
      description: {
        story: 'グラディエント背景での表示例。Glassmorphism効果が際立ちます。',
      },
    },
  },
};

/**
 * モバイル表示
 */
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: 'モバイルデバイスでの表示例。フルスクリーン表示に最適化されます。',
      },
    },
  },
};

/**
 * タブレット表示
 */
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    docs: {
      description: {
        story: 'タブレットデバイスでの表示例。中間サイズの画面に最適化されます。',
      },
    },
  },
};

/**
 * デスクトップ表示
 */
export const Desktop: Story = {
  args: {},
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'デスクトップでの表示例。大画面でのレイアウトを確認できます。',
      },
    },
  },
};
