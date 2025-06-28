# Custom Card Components

Material Design 3準拠の汎用カードコンポーネントです。プロジェクト全体で統一されたカードUIを提供します。

## 概要

- **CustomCard**: 多機能なカードコンポーネント
- **CustomCardContent**: 統一されたパディングとレイアウトを提供するコンテンツコンポーネント

## 基本的な使い方

```tsx
import { CustomCard, CustomCardContent } from '@/components/ui/Card';

// 基本的なカード
<CustomCard>
  <CustomCardContent>
    <Typography variant="h6">カードタイトル</Typography>
    <Typography variant="body2">カードの内容</Typography>
  </CustomCardContent>
</CustomCard>

// インタラクティブなカード
<CustomCard 
  interactive 
  hoverEffect="lift"
  onClick={() => console.log('clicked')}
>
  <CustomCardContent>
    <Typography variant="h6">クリック可能なカード</Typography>
  </CustomCardContent>
</CustomCard>
```

## カードバリアント

### surface（基本サーフェス）
```tsx
<CustomCard variant="surface">
  <CustomCardContent>基本サーフェス</CustomCardContent>
</CustomCard>
```

### elevated（立体感あり）
```tsx
<CustomCard variant="elevated" surfaceLevel={2}>
  <CustomCardContent>立体感のあるカード</CustomCardContent>
</CustomCard>
```

### outlined（アウトライン）
```tsx
<CustomCard variant="outlined">
  <CustomCardContent>アウトラインカード</CustomCardContent>
</CustomCard>
```

### filled（塗りつぶし）
```tsx
<CustomCard variant="filled">
  <CustomCardContent>塗りつぶしカード</CustomCardContent>
</CustomCard>
```

## ホバー効果

```tsx
// リフト効果（デフォルト）
<CustomCard interactive hoverEffect="lift">
  <CustomCardContent>ホバー時に浮き上がる</CustomCardContent>
</CustomCard>

// グロー効果
<CustomCard interactive hoverEffect="glow">
  <CustomCardContent>ホバー時に光る</CustomCardContent>
</CustomCard>

// スケール効果
<CustomCard interactive hoverEffect="scale">
  <CustomCardContent>ホバー時に拡大</CustomCardContent>
</CustomCard>

// 効果なし
<CustomCard interactive hoverEffect="none">
  <CustomCardContent>ホバー効果なし</CustomCardContent>
</CustomCard>
```

## 角丸設定

```tsx
<CustomCard borderRadius="small">    {/* 8px */}
<CustomCard borderRadius="medium">   {/* 12px */}
<CustomCard borderRadius="large">    {/* 16px */}
<CustomCard borderRadius="extraLarge"> {/* 28px */}
```

## CardContent のレイアウト

### パディング設定
```tsx
<CustomCardContent padding="xs">   {/* 2px */}
<CustomCardContent padding="sm">   {/* 4px */}
<CustomCardContent padding="md">   {/* 8px - デフォルト */}
<CustomCardContent padding="lg">   {/* 12px */}
<CustomCardContent padding="xl">   {/* 16px */}
<CustomCardContent padding="xxl">  {/* 20px */}
```

### フレックスレイアウト
```tsx
<CustomCardContent 
  flex 
  flexDirection="column" 
  gap="md"
  fullHeight
>
  <Typography variant="h6">タイトル</Typography>
  <Typography variant="body2" sx={{ flex: 1 }}>内容</Typography>
  <Button>アクション</Button>
</CustomCardContent>
```

### 個別パディング設定
```tsx
<CustomCardContent 
  paddingX="lg"    // 水平方向のパディング
  paddingY="sm"    // 垂直方向のパディング
>
  <Typography>コンテンツ</Typography>
</CustomCardContent>
```

## 実用例

### 機能カード
```tsx
<CustomCard 
  interactive
  hoverEffect="lift"
  variant="elevated"
  surfaceLevel={1}
  onClick={handleClick}
>
  <CustomCardContent flex flexDirection="column" gap="md">
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Icon color="primary" />
      <Typography variant="h6">機能名</Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
      機能の説明文がここに入ります。
    </Typography>
    <Button variant="outlined" size="small">
      詳しく見る
    </Button>
  </CustomCardContent>
</CustomCard>
```

### 情報カード
```tsx
<CustomCard variant="outlined" borderRadius="medium">
  <CustomCardContent 
    padding="lg" 
    removeLastChildMargin
  >
    <Typography variant="h5" gutterBottom>
      情報タイトル
    </Typography>
    <Typography variant="body1" paragraph>
      詳細な情報がここに表示されます。
    </Typography>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Chip label="タグ1" size="small" />
      <Chip label="タグ2" size="small" />
    </Box>
  </CustomCardContent>
</CustomCard>
```

## アクセシビリティ

```tsx
<CustomCard 
  interactive
  focusable  // キーボードフォーカス可能
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  <CustomCardContent>
    <Typography>アクセシブルなカード</Typography>
  </CustomCardContent>
</CustomCard>
```

## Props一覧

### CustomCard Props
- `variant`: カードのバリアント（'surface' | 'elevated' | 'outlined' | 'filled'）
- `surfaceLevel`: 立体感レベル（0-5、elevatedバリアント時のみ）
- `interactive`: インタラクティブなカード（boolean）
- `hoverEffect`: ホバー効果（'lift' | 'glow' | 'scale' | 'none'）
- `borderRadius`: 角丸サイズ（'none' | 'small' | 'medium' | 'large' | 'extraLarge'）
- `animated`: アニメーション有効（boolean）
- `focusable`: フォーカス可能（boolean）

### CustomCardContent Props
- `padding`: パディングサイズ（'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'）
- `paddingY`: 垂直方向のパディング
- `paddingX`: 水平方向のパディング
- `align`: コンテンツの配置（'start' | 'center' | 'end' | 'stretch'）
- `flex`: フレックスレイアウト（boolean）
- `flexDirection`: フレックス方向（'row' | 'column' | 'row-reverse' | 'column-reverse'）
- `gap`: アイテム間のギャップ
- `fullHeight`: 高さを親に合わせる（boolean）
- `removeLastChildMargin`: 最後の子要素のマージンボトムを削除（boolean）

## デザインシステム連携

これらのコンポーネントは、プロジェクトのデザインシステム（`theme/designSystem.ts`）と完全に統合されており、統一されたスペーシング、カラー、タイポグラフィを使用します。
