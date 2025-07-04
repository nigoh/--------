/**
 * Firebase Functions: Custom Claims 設定用スクリプト
 * Super Admin 権限の設定
 */
const admin = require('firebase-admin');

// Firebase Admin SDK の初期化
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * ユーザーにSuper Admin権限を付与
 * @param {string} uid ユーザーID
 * @param {object} claims カスタムクレーム
 */
async function setSuperAdminClaims(uid, claims = {}) {
  try {
    const defaultClaims = {
      roles: ['super_admin', 'admin'],
      permissions: ['*'], // 全権限
      isSuperAdmin: true,
      isSystemUser: true,
      lastRoleUpdate: new Date().toISOString(),
      ...claims
    };

    await admin.auth().setCustomUserClaims(uid, defaultClaims);
    
    console.log(`✅ ユーザー ${uid} にSuper Admin権限を付与しました`);
    console.log('設定されたClaims:', defaultClaims);
    
    return { success: true, claims: defaultClaims };
  } catch (error) {
    console.error('❌ Custom Claims設定エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ユーザーのCustom Claimsを確認
 * @param {string} uid ユーザーID
 */
async function getUserClaims(uid) {
  try {
    const user = await admin.auth().getUser(uid);
    console.log(`ユーザー ${uid} のCustom Claims:`, user.customClaims || {});
    return user.customClaims || {};
  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    return null;
  }
}

/**
 * Custom Claims を削除
 * @param {string} uid ユーザーID
 */
async function removeCustomClaims(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, null);
    console.log(`✅ ユーザー ${uid} のCustom Claimsを削除しました`);
    return { success: true };
  } catch (error) {
    console.error('❌ Custom Claims削除エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 管理者権限を持つ全ユーザーを一覧表示
 */
async function listAdminUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const adminUsers = listUsersResult.users.filter(user => 
      user.customClaims && 
      (user.customClaims.isSuperAdmin || user.customClaims.roles?.includes('admin'))
    );

    console.log('=== 管理者ユーザー一覧 ===');
    adminUsers.forEach(user => {
      console.log(`UID: ${user.uid}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.displayName}`);
      console.log(`Claims:`, user.customClaims);
      console.log('---');
    });

    return adminUsers;
  } catch (error) {
    console.error('管理者ユーザー一覧取得エラー:', error);
    return [];
  }
}

// Firebase Functions として使用する場合
const functions = require('firebase-functions');

exports.setSuperAdminClaims = functions.https.onCall(async (data, context) => {
  // 認証チェック
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  // 既存の管理者のみが新しい管理者を作成可能
  const callerClaims = context.auth.token;
  if (!callerClaims.isSuperAdmin && !callerClaims.roles?.includes('super_admin')) {
    throw new functions.https.HttpsError('permission-denied', 'Super Admin権限が必要です');
  }

  const { uid, claims } = data;
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UIDが必要です');
  }

  return await setSuperAdminClaims(uid, claims);
});

exports.getUserClaims = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  const { uid } = data;
  return await getUserClaims(uid || context.auth.uid);
});

// 直接実行用（開発環境）
if (require.main === module) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('=== Firebase Custom Claims 管理ツール ===');
  console.log('1. Super Admin権限を付与');
  console.log('2. ユーザーのClaims確認');
  console.log('3. 管理者ユーザー一覧');
  console.log('4. Claims削除');

  rl.question('操作を選択してください (1-4): ', async (choice) => {
    switch (choice) {
      case '1':
        rl.question('ユーザーUID: ', async (uid) => {
          await setSuperAdminClaims(uid);
          rl.close();
        });
        break;
      case '2':
        rl.question('ユーザーUID: ', async (uid) => {
          await getUserClaims(uid);
          rl.close();
        });
        break;
      case '3':
        await listAdminUsers();
        rl.close();
        break;
      case '4':
        rl.question('ユーザーUID: ', async (uid) => {
          await removeCustomClaims(uid);
          rl.close();
        });
        break;
      default:
        console.log('無効な選択です');
        rl.close();
    }
  });
}

module.exports = {
  setSuperAdminClaims,
  getUserClaims,
  removeCustomClaims,
  listAdminUsers
};
