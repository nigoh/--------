# Firebase TOTP MFA 設定ガイド

## 1. Firebase Console での設定手順

### Step 1: Firebase Console にアクセス
1. https://console.firebase.google.com/ にアクセス
2. プロジェクト `feedbackaiapp` を選択

### Step 2: Identity Platform へのアップグレード（必要に応じて）
1. 左メニューから「Authentication」を選択
2. 「Sign-in method」タブを選択
3. 「多要素認証」セクションを確認
4. 「Identity Platform にアップグレード」が表示されている場合は、アップグレードを実行

### Step 3: TOTP MFA の有効化
1. Authentication > Sign-in method ページで「多要素認証」セクションを表示
2. 「TOTP（Time-based One-Time Password）」の設定を確認
3. 有効になっていない場合は、有効化する

### Step 4: プロジェクト設定の確認
1. プロジェクト設定（歯車アイコン）> 「全般」タブを選択
2. プロジェクトIDが `feedbackaiapp` であることを確認
3. ウェブアプリの設定から Firebase Config を取得

## 2. 環境変数の設定

以下の環境変数ファイル（`.env.local`）を作成：

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=feedbackaiapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=feedbackaiapp
VITE_FIREBASE_STORAGE_BUCKET=feedbackaiapp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 3. TOTP MFA テスト手順

### 前提条件
- ユーザーがFirebase Authenticationに登録済み
- ユーザーのメールアドレスが確認済み

### テスト手順
1. アプリにログイン
2. MFA設定画面にアクセス
3. 「認証アプリの設定」ボタンをクリック
4. 表示されたQRコードを認証アプリ（Google Authenticator等）でスキャン
5. 認証アプリで生成された6桁のコードを入力
6. MFA設定完了

### 認証フロー
1. 通常のログイン（メール/パスワード）
2. MFA設定済みの場合、TOTPコード入力画面が表示
3. 認証アプリから6桁のコードを入力
4. ログイン完了

## 4. トラブルシューティング

### エラー: "Firebase Consoleでマルチファクター認証を有効にしてください"
- Firebase Console でTOTP MFAが有効になっていない
- Identity Platform へのアップグレードが必要

### エラー: "メールアドレスの確認が必要です"
- ユーザーのメールアドレスが未確認
- Firebase Console > Authentication > Users でメール確認状況を確認

### エラー: "admin/invalid-credential"
- Firebase Admin SDK の認証設定が不正
- サービスアカウントキーが必要（Consoleでの手動設定を推奨）

## 5. 開発環境での注意事項

- Firebase Emulator では TOTP MFA は完全にサポートされていません
- 本番のFirebaseプロジェクトでのテストが必要
- 開発時は `.env.local` の設定を正しく行う

## 6. 本番環境での注意事項

- App Check の設定を検討
- セキュリティルールの適切な設定
- ユーザビリティを考慮したエラーハンドリング
