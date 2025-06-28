import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Favorite, Share, MoreVert } from '@mui/icons-material';
import { CustomCard, CustomCardContent } from './index';

const meta: Meta<typeof CustomCard> = {
  title: 'Components/UI/Card',
  component: CustomCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Material Design 3準拠の汎用カードコンポーネント。様々なバリエーションとインタラクションをサポートします。',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['surface', 'elevated', 'outlined', 'filled'],
      description: 'カードのバリアント',
    },
    surfaceLevel: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5],
      description: '立体感レベル（elevatedバリアント時のみ有効）',
    },
    interactive: {
      control: 'boolean',
      description: 'インタラクティブなカード（ホバー効果付き）',
    },
    hoverEffect: {
      control: 'select',
      options: ['lift', 'glow', 'scale', 'none'],
      description: 'ホバー効果の種類',
    },
    borderRadius: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large', 'extraLarge'],
      description: '角丸サイズ',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomCard>;

// 基本的なカード
export const Default: Story = {
  render: (args) => (
    <CustomCard {...args} sx={{ maxWidth: 345 }}>
      <CustomCardContent>
        <Typography variant="h6" gutterBottom>
          基本カード
        </Typography>
        <Typography variant="body2" color="text.secondary">
          これは基本的なカードコンポーネントです。
          Material Design 3の仕様に従ったデザインとなっています。
        </Typography>
      </CustomCardContent>
    </CustomCard>
  ),
};

// インタラクティブカード
export const Interactive: Story = {
  args: {
    interactive: true,
    hoverEffect: 'lift',
  },
  render: (args) => (
    <CustomCard {...args} sx={{ maxWidth: 345 }} onClick={() => alert('カードがクリックされました！')}>
      <CustomCardContent>
        <Typography variant="h6" gutterBottom>
          インタラクティブカード
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          このカードはクリック可能で、ホバー効果があります。
        </Typography>
        <Button size="small">アクション</Button>
      </CustomCardContent>
    </CustomCard>
  ),
};

// 各バリアント
export const Variants: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
      <CustomCard variant="surface">
        <CustomCardContent padding="sm">
          <Typography variant="subtitle2">Surface</Typography>
          <Typography variant="body2" color="text.secondary">
            基本サーフェス
          </Typography>
        </CustomCardContent>
      </CustomCard>
      
      <CustomCard variant="elevated" surfaceLevel={2}>
        <CustomCardContent padding="sm">
          <Typography variant="subtitle2">Elevated</Typography>
          <Typography variant="body2" color="text.secondary">
            立体感あり
          </Typography>
        </CustomCardContent>
      </CustomCard>
      
      <CustomCard variant="outlined">
        <CustomCardContent padding="sm">
          <Typography variant="subtitle2">Outlined</Typography>
          <Typography variant="body2" color="text.secondary">
            アウトライン
          </Typography>
        </CustomCardContent>
      </CustomCard>
      
      <CustomCard variant="filled">
        <CustomCardContent padding="sm">
          <Typography variant="subtitle2">Filled</Typography>
          <Typography variant="body2" color="text.secondary">
            塗りつぶし
          </Typography>
        </CustomCardContent>
      </CustomCard>
    </Box>
  ),
};

// ホバー効果
export const HoverEffects: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
      {(['lift', 'glow', 'scale', 'none'] as const).map((effect) => (
        <CustomCard 
          key={effect}
          interactive 
          hoverEffect={effect}
          sx={{ maxWidth: 200 }}
        >
          <CustomCardContent padding="sm">
            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
              {effect} Effect
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ホバーしてみてください
            </Typography>
          </CustomCardContent>
        </CustomCard>
      ))}
    </Box>
  ),
};

// 角丸バリエーション
export const BorderRadius: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
      {(['none', 'small', 'medium', 'large', 'extraLarge'] as const).map((radius) => (
        <CustomCard 
          key={radius}
          borderRadius={radius}
          sx={{ maxWidth: 150 }}
        >
          <CustomCardContent padding="xs">
            <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
              {radius}
            </Typography>
          </CustomCardContent>
        </CustomCard>
      ))}
    </Box>
  ),
};

// 複雑なカード（実用例）
export const Complex: Story = {
  render: () => (
    <CustomCard 
      interactive
      hoverEffect="lift"
      sx={{ maxWidth: 345 }}
    >
      <CustomCardContent 
        flex 
        gap="md" 
        removeLastChildMargin
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6">
            チーム分け機能
          </Typography>
          <Button size="small" sx={{ minWidth: 'auto', p: 0.5 }}>
            <MoreVert fontSize="small" />
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          AIを活用したスマートなチーム編成で、バランスの取れたグループを自動生成します。
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="AI" size="small" color="primary" />
          <Chip label="自動化" size="small" color="secondary" />
          <Chip label="効率化" size="small" />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" startIcon={<Favorite />}>
              お気に入り
            </Button>
            <Button size="small" startIcon={<Share />}>
              共有
            </Button>
          </Box>
          <Button variant="contained" size="small">
            開始
          </Button>
        </Box>
      </CustomCardContent>
    </CustomCard>
  ),
};

// CardContentのパディングバリエーション
export const PaddingVariations: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((padding) => (
        <CustomCard key={padding} variant="outlined">
          <CustomCardContent padding={padding}>
            <Typography variant="subtitle2">
              Padding: {padding}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              パディングサイズの例
            </Typography>
          </CustomCardContent>
        </CustomCard>
      ))}
    </Box>
  ),
};
