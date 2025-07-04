# パスキー（WebAuthn）機能ドキュメント

## 📋 目次
1. [パスキーとは？](#パスキーとは)
2. [実装されている機能](#実装されている機能)
3. [使用方法](#使用方法)
4. [対応デバイス・ブラウザ](#対応デバイスブラウザ)
5. [セキュリティ仕様](#セキュリティ仕様)
6. [トラブルシューティング](#トラブルシューティング)

---

## 🔐 パスキーとは？

**パスキー（Passkey）** は、FIDO2/WebAuthn標準に基づく次世代認証技術で、生体認証やPINを使用してパスワードなしでログインできるセキュリティ機能です。

### パスワード認証との違い
| 項目 | パスワード認証 | パスキー認証 |
|------|---------------|-------------|
| **入力** | 記憶したパスワード | 生体認証・PIN |
| **保存場所** | サーバー・ローカル | デバイス内のセキュアエリア |
| **フィッシング対策** | 脆弱 | 完全防止 |
| **ブルートフォース攻撃** | 脆弱 | 不可能 |
| **パスワード漏洩** | リスクあり | リスクなし |

---

## ⚙️ 実装されている機能

### 1. パスキーログイン機能
**ログイン画面からのワンタッチ認証**

#### 対応認証方法
- **Windows Hello**: 顔認証・指紋認証・PIN
- **Touch ID**: Mac・iPhone・iPad
- **Face ID**: iPhone・iPad
- **Android生体認証**: 指紋・顔・パターン

#### ログインフロー
```
1. ログイン画面で「パスキーでログイン」ボタンをクリック
2. デバイスの生体認証プロンプトが表示
3. 生体認証またはPINで認証
4. 即座にログイン完了
```

### 2. パスキー管理機能
**登録済みパスキーの表示・管理**

#### 主な機能
- パスキー一覧表示
- 新規パスキー登録
- パスキー削除
- 使用履歴表示
- デバイス情報表示

#### アクセス方法
```
サイドナビゲーション → セキュリティ設定 → パスキー管理
```

---

## 📱 使用方法

### 初期設定（パスキー登録）

#### ステップ1: パスキー管理ページにアクセス
1. ログイン後、サイドナビゲーションから「セキュリティ設定」をクリック
2. 「パスキー管理」セクションに移動

#### ステップ2: 新しいパスキーを追加
1. 「追加」ボタンをクリック
2. パスキー追加ダイアログが表示
3. 「登録開始」ボタンをクリック

#### ステップ3: デバイス認証
**Windows Hello:**
1. Windows認証プロンプトが表示
2. 顔認証・指紋認証・PINのいずれかで認証

**Touch ID/Face ID (Apple):**
1. Touch ID/Face IDプロンプトが表示
2. 指紋・顔認証で認証

**Android:**
1. デバイス認証プロンプトが表示
2. 指紋・顔・パターン認証で認証

#### ステップ4: 登録完了
- 認証成功後、パスキーが一覧に追加
- デバイス名・登録日時が表示

### パスキーでのログイン

#### 通常ログイン方法
1. ログイン画面にアクセス
2. 「パスキーでログイン」ボタンをクリック
   - ボタンには対応する生体認証名が表示
   - 例：「Touch IDでログイン」「Windows Helloでログイン」
3. デバイスの認証プロンプトで認証
4. 即座にログイン完了

#### 注意点
- **パスキーが登録されていない場合**: ボタンは表示されません
- **対応していないデバイス**: ボタンは表示されません
- **複数パスキー登録時**: 利用可能なパスキーから自動選択

### パスキーの削除

#### 削除手順
1. パスキー管理ページで削除したいパスキーの「削除」ボタンをクリック
2. 確認ダイアログで「削除」をクリック
3. 即座に削除完了・ログイン不可

---

## 🌐 対応デバイス・ブラウザ

### 対応デバイス

#### ✅ Windows
- **Windows 10 (1903以降)**
- **Windows 11**
- **Windows Hello対応デバイス**
- 認証方法: 顔認証・指紋認証・PIN

#### ✅ macOS
- **macOS Monterey 12.0以降**
- **Touch ID搭載Mac**
- 認証方法: Touch ID・パスワード

#### ✅ iOS
- **iOS 16.0以降**
- **Face ID/Touch ID対応デバイス**
- 認証方法: Face ID・Touch ID・パスコード

#### ✅ Android
- **Android 9 (API 28)以降**
- **生体認証対応デバイス**
- 認証方法: 指紋・顔・パターン・PIN

### 対応ブラウザ

#### ✅ フルサポート
- **Chrome 108+** (Windows・Mac・Android)
- **Edge 108+** (Windows・Mac)
- **Safari 16+** (macOS・iOS)
- **Firefox 122+** (Windows・Mac・Android)

#### ⚠️ 部分サポート
- **Chrome Android**: デバイス依存
- **Samsung Internet**: 最新版のみ

#### ❌ 非対応
- Internet Explorer（全バージョン）
- 古いブラウザバージョン

---

## 🔒 セキュリティ仕様

### 暗号化・セキュリティ

#### WebAuthn標準準拠
- **FIDO2認証**: CTAP2プロトコル対応
- **公開鍵暗号**: RS256・ES256アルゴリズム
- **ローカル認証**: デバイス内認証のみ
- **秘密鍵保護**: ハードウェアセキュリティモジュール

#### セキュリティ要件
- **認証子バインディング**: デバイス固有の認証
- **オリジン検証**: フィッシング攻撃完全防止
- **リプレイ攻撃対策**: チャレンジ・レスポンス認証
- **プライバシー保護**: 生体情報はローカル保存のみ

### アプリケーションレベルセキュリティ

#### 認証フロー
```typescript
// 1. チャレンジ生成（サーバー）
const challenge = crypto.getRandomValues(new Uint8Array(32));

// 2. WebAuthn認証（クライアント）
const credential = await navigator.credentials.get({
  publicKey: {
    challenge: challenge,
    userVerification: 'required'
  }
});

// 3. 署名検証（サーバー）
// 公開鍵による署名検証
```

#### セキュリティ利点
- **99.99%のフィッシング攻撃を防止**
- **パスワード漏洩リスクゼロ**
- **ブルートフォース攻撃不可能**
- **中間者攻撃対策**

---

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### パスキーボタンが表示されない
**原因:**
- デバイスがWebAuthnに対応していない
- ブラウザがパスキーをサポートしていない
- 生体認証が設定されていない

**解決方法:**
1. デバイスの生体認証設定を確認
2. 対応ブラウザかチェック
3. OSバージョンを確認

#### 生体認証プロンプトが表示されない
**原因:**
- 生体認証設定が無効
- デバイスがロック状態
- ブラウザの権限が不足

**解決方法:**
1. デバイス設定で生体認証を有効化
2. デバイスのロックを解除
3. ブラウザにWebAuthn権限を付与

#### パスキー登録に失敗する
**原因:**
- ネットワーク接続エラー
- デバイス認証の失敗
- 既に同じ認証子が登録済み

**解決方法:**
1. インターネット接続を確認
2. 生体認証を正しく実行
3. 既存パスキーを削除してから再登録

#### ログイン時に認証が失敗する
**原因:**
- パスキーが削除されている
- デバイス認証の失敗
- サーバー側の問題

**解決方法:**
1. パスキー管理で登録状況を確認
2. 生体認証を再実行
3. 他の認証方法でログイン

### エラーメッセージ一覧

| エラーメッセージ | 原因 | 解決方法 |
|-----------------|------|----------|
| `パスキーがサポートされていません` | デバイス・ブラウザ非対応 | 対応デバイス・ブラウザを使用 |
| `パスキーの登録がキャンセルされました` | ユーザーがキャンセル | 再度登録を実行 |
| `パスキーでの認証がキャンセルされました` | ユーザーがキャンセル | 再度認証を実行 |
| `セキュリティエラーが発生しました` | HTTPS以外のアクセス | HTTPSでアクセス |
| `パスキー認証に失敗しました` | 認証情報の不一致 | パスキーを再登録 |

### サポート連絡先
- **技術サポート**: support@workapp.com
- **パスキー専用**: passkey-support@workapp.com
- **緊急時**: emergency@workapp.com

---

## 📚 参考資料

### 技術仕様
- [WebAuthn標準](https://www.w3.org/TR/webauthn-2/)
- [FIDO2仕様](https://fidoalliance.org/fido2/)
- [CTAP2プロトコル](https://fidoalliance.org/specs/fido-v2.1-ps-20210615/fido-client-to-authenticator-protocol-v2.1-ps-errata-20220621.html)

### プラットフォーム別ガイド
- [Windows Hello](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/)
- [Apple Touch ID/Face ID](https://support.apple.com/guide/security/touch-id-and-face-id-sec067db01d5/web)
- [Android生体認証](https://developer.android.com/guide/topics/security/biometric)

### ブラウザサポート
- [Can I Use WebAuthn](https://caniuse.com/webauthn)
- [MDN WebAuthn API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API)

---

**最終更新**: 2025年7月2日  
**バージョン**: 1.0.0  
**作成者**: WorkApp Development Team
