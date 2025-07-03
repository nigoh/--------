# Firebase Admin SDK サービスアカウント設定ガイド

## サービスアカウントキーの取得手順

### 1. Firebase Console でサービスアカウントキーを生成
1. Firebase Console > プロジェクト設定（歯車アイコン）
2. 「サービスアカウント」タブを選択
3. 「新しい秘密鍵の生成」をクリック
4. JSON ファイルをダウンロード

### 2. 環境変数の設定
```bash
# 方法A: 環境変数でファイルパスを指定
set GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json

# 方法B: 環境変数でJSON内容を直接指定
set GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

### 3. スクリプトの実行
```bash
node scripts/enable-totp-mfa.js
```

## 注意事項

- サービスアカウントキーは機密情報です
- リポジトリにコミットしないでください
- `.gitignore` に追加してください

```gitignore
# Firebase サービスアカウントキー
serviceAccountKey.json
firebase-adminsdk-*.json
```

## 推奨事項

開発段階では **Firebase Console での手動設定** を推奨します：
- セキュリティリスクが低い
- 設定が簡単
- 即座に反映される
