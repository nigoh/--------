/**
 * 開発環境用：Super Admin作成スクリプト
 * コンソールから直接実行してSuper Adminを作成
 */
import { createDemoSuperAdmin, createSuperAdminUser } from '../features/adminManagement/services/createAdminUser';

// ブラウザのコンソールで実行できるグローバル関数を定義
declare global {
  interface Window {
    createSuperAdmin: typeof createSuperAdminUser;
    createDemoAdmin: typeof createDemoSuperAdmin;
    adminUtils: {
      createCustomAdmin: (email: string, password: string, name: string) => Promise<any>;
      createDefaultAdmin: () => Promise<any>;
    };
  }
}

// コンソールから使用可能な関数群
const adminUtils = {
  /**
   * カスタムSuper Admin作成
   */
  createCustomAdmin: async (email: string, password: string, name: string) => {
    console.log('🔧 カスタムSuper Admin作成中...');
    
    try {
      const result = await createSuperAdminUser({
        email,
        password,
        displayName: name,
        department: 'システム管理部',
        position: 'システム管理者'
      });

      if (result.success) {
        console.log('✅ Super Admin作成成功!');
        console.log(`📧 Email: ${email}`);
        console.log(`🆔 UID: ${result.uid}`);
        console.log(`👤 Name: ${name}`);
        console.log('⚠️  Custom Claimsの設定もお忘れなく！');
        return result;
      } else {
        console.error('❌ 作成失敗:', result.message);
        return result;
      }
    } catch (error) {
      console.error('❌ エラー:', error);
      return { success: false, error };
    }
  },

  /**
   * デフォルトSuper Admin作成（admin@company.com）
   */
  createDefaultAdmin: async () => {
    console.log('🔧 デフォルトSuper Admin作成中...');
    console.log('📧 Email: admin@company.com');
    console.log('🔑 Password: SecurePassword123!');
    
    try {
      const result = await createDemoSuperAdmin();
      
      if (result.success) {
        console.log('✅ デフォルトSuper Admin作成成功!');
        console.log(`🆔 UID: ${result.uid}`);
        console.log('⚠️  Custom Claimsの設定もお忘れなく！');
        
        // ログイン用の情報を表示
        console.log('\n📝 ログイン情報:');
        console.log('Email: admin@company.com');
        console.log('Password: SecurePassword123!');
        
        return result;
      } else {
        console.error('❌ 作成失敗:', result.message);
        return result;
      }
    } catch (error) {
      console.error('❌ エラー:', error);
      return { success: false, error };
    }
  }
};

// 開発環境でのみグローバルに公開
if (import.meta.env.DEV) {
  // ウィンドウオブジェクトに関数を追加
  window.createSuperAdmin = createSuperAdminUser;
  window.createDemoAdmin = createDemoSuperAdmin;
  window.adminUtils = adminUtils;

  // コンソールにヘルプメッセージを表示
  console.log(`
🔧 =====================================
   Super Admin 作成ツール (開発環境)
=====================================

📝 使用方法:

1️⃣  デフォルト管理者作成:
   adminUtils.createDefaultAdmin()

2️⃣  カスタム管理者作成:
   adminUtils.createCustomAdmin(
     'your-email@company.com',
     'YourPassword123!',
     'あなたの名前'
   )

3️⃣  詳細設定で作成:
   createSuperAdmin({
     email: 'admin@example.com',
     password: 'SecurePass123!',
     displayName: '管理者名',
     department: '部署名',
     position: '役職名'
   })

⚠️  注意事項:
• Custom Claimsの設定は別途Firebase Admin SDKが必要
• 本番環境では使用しないでください
• パスワードは8文字以上、複雑なものを使用してください

=====================================
  `);
}

export { adminUtils };
