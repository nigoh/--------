import type { Meta, StoryObj } from '@storybook/react';
import { BentoGrid, BentoItem } from './BentoGrid';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

/**
 * Bento Grid System
 * 
 * Material Design 3準拠のレスポンシブグリッドレイアウトシステム
 */
const meta: Meta<typeof BentoGrid> = {
  title: 'Components/Layout/BentoGrid',
  component: BentoGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Bento Grid System

Modern responsive grid layout inspired by the Japanese bento box design philosophy.

#### 特徴
- **レスポンシブ**: 自動的なレイアウト調整
- **フレキシブル**: 様々なコンテンツサイズに対応
- **アニメーション**: 滑らかなエントランスアニメーション
- **Material Design 3**: 現代的なデザインシステム

#### 使用方法
\`items\` プロパティに \`BentoItem\` の配列を渡します。各アイテムには\`span\`を指定してレイアウトをカスタマイズできます。
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: false,
      description: 'グリッドアイテムの配列',
    },
    columns: {
      control: 'object',
      description: 'レスポンシブな列数設定',
    },
    gap: {
      control: { type: 'number', min: 1, max: 8 },
      description: 'グリッドアイテム間のギャップ',
    },
    animated: {
      control: 'boolean',
      description: 'アニメーションの有効/無効',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルコンテンツコンポーネント
const SampleCard = ({ title, icon: Icon, height = 120 }: { title: string; icon: any; height?: number }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: height,
      textAlign: 'center',
    }}>
      <Icon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

// ダッシュボード用のアイテム
const dashboardItems: BentoItem[] = [
  {
    id: 'main-dashboard',
    content: <SampleCard title="メインダッシュボード" icon={DashboardIcon} height={200} />,
    span: { xs: 2, md: 2, lg: 2 },
    minHeight: 200,
  },
  {
    id: 'analytics',
    content: <SampleCard title="アナリティクス" icon={AnalyticsIcon} />,
    span: { xs: 1, md: 1, lg: 1 },
  },
  {
    id: 'users',
    content: <SampleCard title="ユーザー管理" icon={PeopleIcon} />,
    span: { xs: 1, md: 1, lg: 1 },
  },
  {
    id: 'sales',
    content: <SampleCard title="売上統計" icon={TrendingUpIcon} height={150} />,
    span: { xs: 2, md: 1, lg: 1 },
    minHeight: 150,
  },
  {
    id: 'notifications',
    content: <SampleCard title="通知" icon={NotificationsIcon} />,
    span: { xs: 1, md: 1, lg: 1 },
  },
  {
    id: 'settings',
    content: <SampleCard title="設定" icon={SettingsIcon} />,
    span: { xs: 1, md: 1, lg: 1 },
  },
];

// ギャラリー用のアイテム
const galleryItems: BentoItem[] = Array.from({ length: 8 }).map((_, index) => ({
  id: `gallery-${index}`,
  content: (
    <Box
      sx={{
        height: 200,
        background: `linear-gradient(135deg, 
          hsl(${index * 45}, 70%, 60%), 
          hsl(${index * 45 + 30}, 70%, 70%)
        )`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
      }}
    >
      画像 {index + 1}
    </Box>
  ),
  span: { xs: 1, sm: 1, md: 1, lg: 1 },
  minHeight: 200,
}));

/**
 * ダッシュボードレイアウト
 */
export const Dashboard: Story = {
  args: {
    items: dashboardItems,
    columns: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4 },
    gap: 3,
    animated: true,
  },
  render: (args) => (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <BentoGrid {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ダッシュボード向けの非対称レイアウト。メインコンテンツを強調する設計です。',
      },
    },
  },
};

/**
 * ギャラリーレイアウト
 */
export const Gallery: Story = {
  args: {
    items: galleryItems,
    columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
    gap: 2,
    animated: true,
  },
  render: (args) => (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <BentoGrid {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ギャラリー表示向けの均等レイアウト。画像やメディアコンテンツに最適です。',
      },
    },
  },
};

/**
 * カスタムレイアウト
 */
export const Custom: Story = {
  args: {
    items: [
      {
        id: 'large-card',
        content: <SampleCard title="大きなカード" icon={DashboardIcon} height={300} />,
        span: { xs: 2, md: 2, lg: 2 },
        minHeight: 300,
      },
      {
        id: 'small-1',
        content: <SampleCard title="小さなカード 1" icon={AnalyticsIcon} />,
        span: { xs: 1, md: 1, lg: 1 },
      },
      {
        id: 'small-2',
        content: <SampleCard title="小さなカード 2" icon={PeopleIcon} />,
        span: { xs: 1, md: 1, lg: 1 },
      },
      {
        id: 'wide-card',
        content: <SampleCard title="横長カード" icon={TrendingUpIcon} height={150} />,
        span: { xs: 2, md: 3, lg: 3 },
        minHeight: 150,
      },
    ],
    columns: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4 },
    gap: 3,
    animated: true,
  },
  render: (args) => (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <BentoGrid {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'カスタムグリッドレイアウト。各アイテムの`span`プロパティでサイズを制御できます。',
      },
    },
  },
};

/**
 * アニメーションなし
 */
export const NoAnimation: Story = {
  args: {
    items: dashboardItems.slice(0, 4),
    columns: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3 },
    gap: 2,
    animated: false,
  },
  render: (args) => (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <BentoGrid {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'アニメーションを無効にした表示例。パフォーマンスを重視する場合に使用します。',
      },
    },
  },
};

/**
 * モバイル表示
 */
export const Mobile: Story = {
  args: {
    items: dashboardItems.slice(0, 4),
    columns: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2 },
    gap: 2,
    animated: true,
  },
  render: (args) => (
    <Box sx={{ p: 2, minHeight: '100vh', bgcolor: 'background.default' }}>
      <BentoGrid {...args} />
    </Box>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story: 'モバイルデバイスでの表示例。単列レイアウトに自動調整されます。',
      },
    },
  },
};
