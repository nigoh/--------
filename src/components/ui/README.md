# 統一UIコンポーネント使用ガイド

## 概要

このプロジェクトでは、Material UIをベースとした統一されたUIコンポーネントシステムを提供します。これらのコンポーネントは、一貫性のあるデザイン、アクセシビリティ、型安全性を保証します。

## 利用可能なコンポーネント

### ボタンコンポーネント

#### StandardButton
基本的なボタンコンポーネント

```tsx
import { StandardButton } from '@/components/ui';

// 基本的な使用
<StandardButton variant="contained" size="medium">
  保存
</StandardButton>

// ローディング状態
<StandardButton loading loadingText="保存中...">
  保存
</StandardButton>

// アイコン付き
<StandardButton startIcon={<SaveIcon />} variant="outlined">
  保存
</StandardButton>
```

#### IconButton
アイコンボタンコンポーネント

```tsx
import { IconButton } from '@/components/ui';

// 基本的な使用
<IconButton tooltip="設定を開く">
  <SettingsIcon />
</IconButton>

// バッジ付き
<IconButton badgeCount={5} tooltip="通知">
  <NotificationsIcon />
</IconButton>

// ローディング状態
<IconButton loading>
  <SaveIcon />
</IconButton>
```

#### FAB (Floating Action Button)
フローティングアクションボタン

```tsx
import { FAB } from '@/components/ui';

// 基本的な使用
<FAB tooltip="新規作成">
  <AddIcon />
</FAB>

// 拡張FAB
<FAB label="新規作成" tooltip="新しいアイテムを作成">
  <AddIcon />
</FAB>
```

### フォームコンポーネント

#### StandardTextField
統一されたテキストフィールド

```tsx
import { StandardTextField } from '@/components/ui';

// 基本的な使用
<StandardTextField
  label="ユーザー名"
  placeholder="ユーザー名を入力"
  required
/>

// バリデーション付き
<StandardTextField
  label="メールアドレス"
  type="email"
  error={!!errors.email}
  errorMessage={errors.email}
  success={isValid}
/>

// 文字数制限付き
<StandardTextField
  label="コメント"
  multiline
  maxLength={200}
  showCharacterCount
  clearable
/>
```

## デザインシステム連携

これらのコンポーネントは、プロジェクトのデザインシステムと完全に統合されています：

- **カラートークン**: `theme/designSystem.ts`で定義された色パレット
- **タイポグラフィ**: 統一されたフォントサイズと行間
- **スペーシング**: 4ptグリッドシステムに基づく一貫した余白
- **アニメーション**: Material Design 3準拠のモーション

## アクセシビリティ

すべてのコンポーネントは以下のアクセシビリティ標準に準拠しています：

- **WCAG 2.1 AA準拠**
- **キーボードナビゲーション対応**
- **スクリーンリーダー対応**
- **フォーカス管理**
- **適切なARIA属性**

## 型安全性

TypeScriptによる厳密な型定義により、開発時のエラーを防止し、IntelliSenseによる補完機能を提供します。

## 移行ガイド

### 既存のMaterial UIコンポーネントからの移行

#### Before (Material UI直接使用)
```tsx
import { Button, TextField } from '@mui/material';

<Button variant="contained" color="primary">
  保存
</Button>

<TextField 
  label="ユーザー名" 
  variant="outlined" 
  fullWidth 
/>
```

#### After (統一コンポーネント使用)
```tsx
import { StandardButton, StandardTextField } from '@/components/ui';

<StandardButton variant="contained" color="primary">
  保存
</StandardButton>

<StandardTextField 
  label="ユーザー名" 
  variant="outlined" 
  fullWidth 
/>
```

## 今後の拡張予定

- Select（セレクトボックス）
- Checkbox（チェックボックス）
- RadioButton（ラジオボタン）
- Switch（スイッチ）
- Slider（スライダー）
- Grid（グリッドシステム）
- Container（コンテナ）

## サポート

問題や要望がある場合は、プロジェクトのIssueまたは開発チームまでお問い合わせください。
