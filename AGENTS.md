
<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

このプロジェクトはReact + Viteで作成された**ランダムチーム分けアプリ**です。チーム分けからミーティング進行まで一貫してサポートするWebアプリケーションで、社員管理機能も備えています。

## プロジェクト概要

### 主要機能
1. **チーム分け機能**: 名簿からランダムにチーム分けを実行（タブインデックス: 0）
2. **ミーティング進行機能**: 5ステップワークフローでミーティングをガイド（タブインデックス: 3）
3. **社員管理機能**: 社員情報のCRUD操作、検索・フィルタリング（タブインデックス: 1）
4. **勤怠管理機能**: 直感的な勤怠記録と分析機能（タブインデックス: 2）
5. **UI/UX機能**: ダークモード、ハイコントラストモード、レスポンシブデザイン

### 設計書について
`doc/`フォルダには**勤怠管理アプリ（Timecard App）**の設計書が格納されていますが、これは将来の開発計画です。現在実装されているのは上記のチーム分けアプリです。

# 開発ルール（保守性・品質向上のため）

## 技術スタック
- **フロントエンド**: React 19 + TypeScript 5
- **UIライブラリ**: MUI v7 (@mui/material)
- **ビルドツール**: Vite 6
- **状態管理**: Zustand 5
- **マークダウン**: react-markdown + remark-gfm
- **開発ツール**: ESLint + TypeScript strict mode

## ワークアプリ向けコンパクトデザインシステム

このプロジェクトではビジネス用途に適した**コンパクトで密度の高いレイアウト**を採用しています。

### スペーシングシステム
```typescript
// 4pt グリッドシステム（ワークアプリ向け）
export const spacingTokens = {
  none: 0,   // 0px
  xs: 2,     // 2px
  sm: 4,     // 4px  
  md: 8,     // 8px
  lg: 12,    // 12px
  xl: 16,    // 16px
  xxl: 20,   // 20px
  xxxl: 24,  // 24px
  xxxxl: 32, // 32px
};
```

### コンポーネントサイズ標準
- **ボタン**: minHeight 32px、小さいボタンは24px
- **入力フィールド**: minHeight 40px、小さいフィールドは32px
- **カード**: padding 8px（標準）、4px（小）
- **リストアイテム**: minHeight 48px、padding 4px-8px
- **アイコン**: 標準24px、小16px、大32px
- **角丸**: 標準8px（small）、4px（extraSmall）

### 余白ルール
- **セクション間**: 8px-12px
- **コンポーネント間**: 4px-8px  
- **要素間**: 2px-4px
- **コンテナ余白**: 8px（モバイル）、12px（デスクトップ）

### ワークアプリ向け設計原則
1. **情報密度優先**: 限られた画面に多くの情報を効率的に配置
2. **操作効率重視**: ボタンやフィールドは十分なクリック領域を確保しつつコンパクト
3. **視覚的統一**: 全コンポーネントで統一されたサイズとスペーシング
4. **レスポンシブ対応**: 小さな画面でも快適に使用可能

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

## Material Design 3 デザインシステム

このプロジェクトは**Material Design 3（Material You）**の設計原則に従います。
https://m3.material.io/ の仕様を基準とし、一貫性のあるモダンなUIを提供します。

### デザイン原則
1. **Adaptive（適応性）**: ユーザーの好み・デバイス・環境に適応
2. **Expressive（表現力）**: ブランドと個性を表現
3. **Dynamic（動的）**: コンテンツに応じて変化

### カラーシステム
- **Primary**: メインブランドカラー（#6750A4）
- **Secondary**: アクセントカラー（#625B71） 
- **Tertiary**: 補完カラー（#7D5260）
- **Error**: エラーカラー（#B3261E）
- **Surface**: 背景・サーフェス（Light: #FFFBFE, Dark: #1C1B1F）

### タイポグラフィ
Material Design 3のタイポグラフィスケールを使用：
- **Display**: 大きな見出し（57px/45px/36px）
- **Headline**: セクション見出し（32px/28px/24px）
- **Title**: タイトル・小見出し（22px/16px/14px）
- **Body**: 本文テキスト（16px/14px/12px）
- **Label**: ボタン・ラベル（14px/12px/11px）

### 形状・角丸
- **None**: 0px
- **Extra Small**: 4px
- **Small**: 8px  
- **Medium**: 12px
- **Large**: 16px
- **Extra Large**: 28px

### Elevation（立体感）
Material Design 3のエレベーション：
- **Level 0**: なし
- **Level 1**: 微細なシャドウ
- **Level 2**: 軽いシャドウ
- **Level 3**: 中程度のシャドウ  
- **Level 4**: 強いシャドウ
- **Level 5**: 最も強いシャドウ

### モーション・アニメーション
- **Duration**: 50ms〜600ms（用途により）
- **Easing**: Standard（cubic-bezier(0.2, 0, 0, 1)）
- **Emphasized**: cubic-bezier(0.2, 0, 0, 1)

### コンポーネント設計ルール

#### 1. スタイルの一元管理
```typescript
// デザインシステムファイルの使用
import { surfaceStyles, buttonStyles, inputStyles } from '../../theme/componentStyles';

// テーマアクセス
const theme = useTheme();

// スタイル適用例
<Button sx={buttonStyles.filled(theme)}>
```

#### 2. Surface（サーフェス）コンポーネント
```typescript
// 標準的なカード
<Paper sx={surfaceStyles.surface(theme)}>

// 立体感のあるカード
<Paper sx={surfaceStyles.elevated(2)(theme)}>

// インタラクティブなサーフェス
<Box sx={surfaceStyles.interactive(theme)}>
```

#### 3. ボタンデザイン
```typescript
// Primary（塗りつぶし）
<Button sx={buttonStyles.filled(theme)}>

// Secondary（アウトライン）
<Button sx={buttonStyles.outlined(theme)}>

// Text（テキストのみ）
<Button sx={buttonStyles.text(theme)}>
```

#### 4. 入力フィールド
```typescript
// アウトライン入力
<TextField sx={inputStyles.outlined(theme)} />

// 塗りつぶし入力
<TextField sx={inputStyles.filled(theme)} />
```

#### 5. アニメーション
```typescript
import { animations } from '../../theme/componentStyles';

// フェードイン
<Box sx={animations.fadeIn}>

// スライドアップ
<Box sx={animations.slideUp}>

// スケールイン
<Box sx={animations.scaleIn}>
```

### 実装ルール

#### 必須事項
- 全てのコンポーネントでuseTheme()を使用
- デザインシステムのスタイル関数を活用
- Material Design 3の色・タイポグラフィ・形状トークンに準拠
- ハイコントラストモード対応

#### 禁止事項
- インラインでの固定色指定（例: color: '#ff0000'）
- 独自のShadow・Border-radiusの定義
- テーマに依存しない固定スタイル
- Material Design 3に反するコンポーネント配置

#### 推奨事項
- レスポンシブ対応（xs/sm/md/lg/xl）
- アニメーション・トランジションの活用
- State Layer（hover/focus/pressed）の実装
- アクセシビリティ配慮（フォーカス・キーボード操作）

### ファイル構成
```
src/
  theme/
    designSystem.ts       # MD3 トークン定義
    modernTheme.ts        # テーマ作成
    componentStyles.ts    # コンポーネントスタイル
  components/             # 共通コンポーネント
  features/              # 機能別コンポーネント
```

### 使用例
```typescript
import { useTheme } from '@mui/material/styles';
import { surfaceStyles, buttonStyles, animations } from '../../theme/componentStyles';

const MyComponent: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Paper sx={{
      ...surfaceStyles.elevated(2)(theme),
      ...animations.fadeIn,
      p: 3,
    }}>
      <Typography variant="h5" sx={{ 
        color: theme.palette.primary.main,
        mb: 2 
      }}>
        Material Design 3
      </Typography>
      <Button sx={buttonStyles.filled(theme)}>
        アクション
      </Button>
    </Paper>
  );
};
```

### 品質保証
- 定期的にMaterial Design 3ガイドラインとの整合性確認
- ダークモード・ハイコントラストモードでの動作確認
- 複数デバイス・画面サイズでの検証
- アクセシビリティテストの実施

## 関心の分離（Separation of Concerns）原則

このプロジェクトでは**関心の分離原則**を徹底し、保守性・テスト性・再利用性の高いコードベースを維持します。

### 基本原則
- **Single Responsibility Principle**: 1つのコンポーネント・関数・モジュールは1つの責任のみを持つ
- **High Cohesion**: 関連性の高い処理は同じモジュールに配置
- **Loose Coupling**: モジュール間の依存関係を最小限に抑制
- **Clear Abstraction**: 各レイヤーの責任を明確に定義

### 責務分離の指針

#### 1. コンポーネントレベルでの分離
```typescript
// ❌ 悪い例：すべての責任が混在
const UserProfile = () => {
  // UI状態管理
  const [isEditing, setIsEditing] = useState(false);
  // API通信
  const [user, setUser] = useState(null);
  // バリデーション
  const [errors, setErrors] = useState({});
  // フォーム送信
  const handleSubmit = async (data) => { /* 長い処理 */ };
  
  return (
    // 複雑なUI構造
  );
};

// ✅ 良い例：責任を分離
const UserProfile = () => {
  return (
    <UserProfileLayout>
      <UserProfileForm />
      <UserProfileActions />
    </UserProfileLayout>
  );
};
```

#### 2. カスタムHookでの論理分離
```typescript
// ビジネスロジック専用Hook
const useUserProfile = (userId: string) => {
  // API通信とデータ管理のみ
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fetchUser = useCallback(async () => {
    setLoading(true);
    const userData = await userAPI.getUser(userId);
    setUser(userData);
    setLoading(false);
  }, [userId]);
  
  return { user, loading, fetchUser };
};

// フォーム管理専用Hook
const useUserForm = (initialData: User) => {
  // フォーム状態とバリデーションのみ
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validate = useCallback((data: User) => {
    // バリデーション処理
  }, []);
  
  return { formData, errors, setFormData, validate };
};
```

#### 3. ファイル構成での分離
```
src/features/userProfile/
├── components/           # UIコンポーネント
│   ├── UserProfileLayout.tsx
│   ├── UserProfileForm.tsx
│   └── UserProfileActions.tsx
├── hooks/               # ビジネスロジック
│   ├── useUserProfile.ts
│   ├── useUserForm.ts
│   └── useUserValidation.ts
├── services/           # API通信・外部サービス
│   ├── userAPI.ts
│   └── userService.ts
├── types/              # 型定義
│   └── userTypes.ts
├── constants/          # 定数・設定
│   └── userConstants.ts
├── utils/              # ユーティリティ関数
│   └── userUtils.ts
└── index.ts            # 統一エクスポート
```

### 責務分離のパターン

#### 1. Container/Presentational パターン
```typescript
// Container（ロジック担当）
const UserProfileContainer: React.FC = () => {
  const { user, loading, updateUser } = useUserProfile();
  const { formData, errors, handleChange, validate } = useUserForm(user);
  
  const handleSubmit = async () => {
    if (validate(formData)) {
      await updateUser(formData);
    }
  };
  
  return (
    <UserProfilePresentation
      user={user}
      loading={loading}
      formData={formData}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

// Presentational（UI担当）
interface UserProfilePresentationProps {
  user: User | null;
  loading: boolean;
  formData: UserFormData;
  errors: FormErrors;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

const UserProfilePresentation: React.FC<UserProfilePresentationProps> = ({
  user, loading, formData, errors, onChange, onSubmit
}) => {
  return (
    // Pure UIコンポーネント
  );
};
```

#### 2. レイヤー分離パターン
```typescript
// Presentation Layer（UI表示）
export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => (
  <Card>
    <Typography>{user.name}</Typography>
    <Button onClick={() => onEdit(user.id)}>編集</Button>
  </Card>
);

// Business Logic Layer（ビジネスルール）
export const useUserOperations = () => {
  const validateUser = (user: User): ValidationResult => {
    // ビジネスルールに基づくバリデーション
  };
  
  const calculateUserScore = (user: User): number => {
    // スコア計算ロジック
  };
  
  return { validateUser, calculateUserScore };
};

// Data Access Layer（データアクセス）
export const userRepository = {
  async getUser(id: string): Promise<User> {
    // API通信処理
  },
  
  async saveUser(user: User): Promise<void> {
    // データ保存処理
  }
};
```

### 分離が必要な兆候

#### ⚠️ リファクタリング対象の特徴
1. **ファイルサイズ**: 200行を超えるコンポーネント
2. **複数の責任**: UI + API + バリデーション + 状態管理が混在
3. **深いネスト**: 3階層を超えるif文やtry-catch
4. **長い関数**: 20行を超える関数
5. **多すぎるuseState**: 5個以上の状態管理
6. **プロパティの多さ**: 10個以上のprops

#### 🔧 分離手法
```typescript
// BEFORE: 責任が混在したコンポーネント
const EmployeeManager = () => {
  // 👎 UI状態 + API + バリデーション + フィルタリングが混在
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ... 300行のコード
};

// AFTER: 責任を分離
const EmployeeManager = () => {
  return (
    <EmployeeManagerLayout>
      <EmployeeSearch />
      <EmployeeList />
      <EmployeeModal />
    </EmployeeManagerLayout>
  );
};

// 各Hookで責任を分離
const useEmployeeData = () => { /* データ管理のみ */ };
const useEmployeeFilters = () => { /* フィルタリングのみ */ };
const useEmployeeModal = () => { /* モーダル状態のみ */ };
```

### 実装ルール

#### 必須事項
- コンポーネントファイルは100行以内を目標とする
- 1つのカスタムHookは1つの機能に特化させる
- APIアクセスはservicesレイヤーに分離する
- ビジネスロジックとUIロジックを混在させない
- 型定義は専用ファイルに分離する

#### 禁止事項
- 1つのコンポーネントで複数のAPI呼び出し
- UI コンポーネント内でのデータ変換処理
- ビジネスロジックのインライン記述
- 複数の関心事を持つカスタムHook

#### 推奨パターン
```typescript
// ✅ 推奨：責任が明確
const UserProfile = () => {
  const user = useUserData(userId);           // データ取得
  const form = useUserForm(user);             // フォーム管理  
  const validation = useValidation(form);     // バリデーション
  const modal = useModal();                   // UI状態
  
  return <UserProfileUI {...{ user, form, validation, modal }} />;
};

// ✅ 推奨：Pure UIコンポーネント
const UserProfileUI = ({ user, form, validation, modal }) => (
  <Card>
    <UserInfo user={user} />
    <UserForm {...form} errors={validation.errors} />
    <UserActions onEdit={modal.open} />
  </Card>
);
```

### 品質メトリクス
- **Cyclomatic Complexity**: 関数あたり10以下
- **Coupling**: モジュール間依存度を最小化
- **Cohesion**: 関連機能の集約度を最大化
- **Test Coverage**: 分離されたモジュールごとに90%以上

### リファクタリング指針
1. **段階的分離**: 一度に全てを変更せず、機能単位で段階的にリファクタリング
2. **テスト駆動**: リファクタリング前にテストを作成し、動作保証を確保
3. **型安全性**: TypeScriptの型システムを活用し、リファクタリング時の安全性を担保
4. **ドキュメント更新**: 分離後の構造をREADMEやコメントで明記