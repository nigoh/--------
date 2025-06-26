このプロジェクトはReact + Viteで作成された**ランダムチーム分けアプリ**です。チーム分けからミーティング進行まで一貫してサポートするWebアプリケーションで、社員管理機能も備えています。

## プロジェクト概要

### 主要機能
1. **チーム分け機能**: 名簿からランダムにチーム分けを実行
2. **ミーティング進行機能**: 5ステップワークフローでミーティングをガイド
3. **社員管理機能**: 社員情報のCRUD操作、検索・フィルタリング
4. **UI/UX機能**: ダークモード、ハイコントラストモード、レスポンシブデザイン

### 設計書について
現在、このリポジトリに設計書は同梱されていません。勤怠管理アプリ（Timecard App）の設計ドキュメントは別リポジトリで管理しており、本リポジトリではランダムチーム分けアプリのみを実装しています。

# 開発ルール（保守性・品質向上のため）

## 技術スタック
- **フロントエンド**: React 19 + TypeScript 5
- **UIライブラリ**: MUI v7 (@mui/material)
- **ビルドツール**: Vite 6
- **状態管理**: Zustand 5
- **マークダウン**: react-markdown + remark-gfm
- **開発ツール**: ESLint + TypeScript strict mode

## コーディング規約
- 関数コンポーネント＋Hooksを基本とする
- 型安全のためTypeScriptを徹底する
- MUIのコンポーネントは公式推奨の使い方を守る
- スタイルはMUIのsxプロパティまたはstyled-componentsで記述（CSSファイル直書きは避ける）
- ファイル・コンポーネント名はパスカルケース（例：TeamCard.tsx、MemberRegister.tsx）
- 1ファイル1コンポーネントを原則とする
- 再利用可能なUIは`src/components`配下に分離
- ビジネスロジックは`src/features`配下に分離
- カスタムHookは`use`プレフィックス（例：useMemberList.ts、useResponsive.ts）

## 保守性・品質
- propsやstateの型定義を明確にする
- 不要なpropsのバケツリレーを避ける（ContextやカスタムHookを活用）
- 可能な限り関数やコンポーネントを小さく保つ
- コメント・JSDocで意図や仕様を明記
- ESLint/Prettierで静的解析・自動整形を徹底
- PRレビュー時はテスト・動作確認を必須とする
- アニメーション・トランジションでUX向上を図る
- アクセシビリティ（focusStyles、キーボード操作）に配慮

## その他
- 外部ライブラリは必要最小限に抑える
- 公式ドキュメント・MUIのガイドラインを参照する
- 仕様変更時はREADMEやこのルールも更新する
- レスポンシブ対応（モバイル・タブレット・デスクトップ）を重視
- 美しいアニメーション（keyframes、Fade、Grow）でUXを向上

## MUIレイアウトのベストプラクティス

このプロジェクトでのMUIレイアウト設計は以下を推奨します。

### 基本方針
- レイアウトの親要素はBoxを活用し、sxで余白・配置を柔軟に指定する
- 複数カラムやレスポンシブはGrid（container/item, spacing, xs/sm/md）を使う
- 縦・横並びや等間隔はStack（direction/spacing）を使う
- ページ全体や主要ブロックはContainer（maxWidth）で中央寄せ・幅制限
- セクションやカードUIはPaper（elevation, sx）で
- 余白・色・フォント等はsxプロパティで一元管理し、テーマ変数も活用

### 例
```
<Container maxWidth="md">
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Box>左カラム</Box>
    </Grid>
    <Grid item xs={12} md={6}>
      <Stack spacing={2}>
        <Box>右上</Box>
        <Box>右下</Box>
      </Stack>
    </Grid>
  </Grid>
</Container>
```

### 参考
- https://mui.com/material-ui/react-box/
- https://mui.com/material-ui/react-grid/
- https://mui.com/material-ui/react-stack/
- https://mui.com/material-ui/react-container/

Box/Stack/Grid/Container/Paper/sxを組み合わせ、スタイルはsxで一元管理すること。

## Zustand状態管理のルール

このプロジェクトでは複雑な状態管理にZustandを使用します。

### 基本方針
- 複数コンポーネント間で共有する状態はZustandストアに配置
- 単一コンポーネント内での状態は従来のuseStateを使用
- 状態とアクションは明確に分離して型定義する
- ストアファイルは`src/features/{機能名}/use{機能名}Store.ts`形式で配置

### ストア作成ルール

#### 1. 型定義の分離
```typescript
// 状態の型定義
export interface FeatureState {
  data: any[];
  loading: boolean;
  error: string | null;
}

// アクションの型定義
export interface FeatureActions {
  setData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// 統合型
export type FeatureStore = FeatureState & FeatureActions;
```

#### 2. ストア実装
```typescript
const initialState: FeatureState = {
  data: [],
  loading: false,
  error: null,
};

export const useFeatureStore = create<FeatureStore>((set, get) => ({
  ...initialState,
  
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
```

#### 3. 使用ルール
- ストアから必要な状態・アクションのみを分割代入で取得
- 複雑な状態更新は専用アクション関数に集約
- 非同期処理もストア内のアクションで管理

#### 4. ベストプラクティス
- アクション名は動詞で統一（set〜, toggle〜, reset, clear等）
- 初期化用の`reset`アクションを必ず提供
- 状態の更新は immutable に行う
- 1つのストアは1つの機能・ドメインに責任を限定

### 例：MeetingFlowストア
```typescript
const { 
  activeStep, 
  timerRunning, 
  nextStep, 
  startTimer, 
  closeAlert 
} = useMeetingFlowStore();
```

### 注意事項
- グローバル状態の濫用を避ける
- コンポーネントローカルな状態は従来のuseStateを使用
- パフォーマンスが重要な箇所では必要な状態のみを購読