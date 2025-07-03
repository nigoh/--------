# ロギング実装: フェーズ1 - 共通フック作成

## 🎯 目標

各機能で再利用可能な共通ロギングフックを作成し、統一されたログ記録方式を確立する。

## 📋 作成するファイル

1. `src/hooks/logging/useFeatureLogger.ts` - 機能別ログ
2. `src/hooks/logging/useCRUDLogger.ts` - CRUD操作専用
3. `src/hooks/logging/useSearchLogger.ts` - 検索操作専用
4. `src/hooks/logging/useExportLogger.ts` - エクスポート専用
5. `src/hooks/logging/index.ts` - エクスポート統合

## 🛠️ 実装開始

まず共通フックのディレクトリを作成し、順次実装していきます。

### 1. useFeatureLogger

最も基本的な機能別ロガーから実装します。
