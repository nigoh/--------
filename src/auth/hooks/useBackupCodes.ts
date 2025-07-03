/**
 * バックアップコード機能のカスタムフック
 * 緊急時アクセス用のワンタイムコード管理
 */
import { useCallback, useState } from 'react';
import { auth } from '../firebase';
import { useAuthStore } from '../stores/useAuthStore';
import type { BackupCode } from '../types';

// バックアップコードフックの戻り値型
interface UseBackupCodesReturn {
  // 状態
  isLoading: boolean;
  error: string | null;
  backupCodes: BackupCode[];
  
  // アクション
  generateBackupCodes: () => Promise<BackupCode[]>;
  verifyBackupCode: (code: string) => Promise<boolean>;
  getUnusedCodes: () => BackupCode[];
  getUsedCodes: () => BackupCode[];
  downloadBackupCodes: (codes: BackupCode[]) => void;
  clearError: () => void;
}

/**
 * バックアップコード機能のカスタムフック
 */
export const useBackupCodes = (): UseBackupCodesReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  
  const { setMfaVerified, setError: setStoreError } = useAuthStore();

  // エラー処理
  const handleError = useCallback((error: any) => {
    const message = error.message || 'バックアップコード操作中にエラーが発生しました';
    setError(message);
    setStoreError(message);
    console.error('Backup Codes Error:', error);
  }, [setStoreError]);

  // ランダムバックアップコード生成
  const generateRandomCode = useCallback((): string => {
    // 8桁の数字コードを生成
    return Math.random().toString().slice(2, 10);
  }, []);

  // バックアップコード生成
  const generateBackupCodes = useCallback(async (): Promise<BackupCode[]> => {
    if (!auth.currentUser) {
      handleError({ message: 'ユーザーがログインしていません' });
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      // 10個のバックアップコード生成
      const codes: BackupCode[] = [];
      const now = new Date();

      for (let i = 0; i < 10; i++) {
        const code: BackupCode = {
          id: crypto.randomUUID(),
          code: generateRandomCode(),
          used: false,
          createdAt: now,
        };
        codes.push(code);
      }

      // TODO: Firebase Firestore/Functions でバックアップコードを保存
      // await saveBackupCodesToFirestore(auth.currentUser.uid, codes);

      setBackupCodes(codes);
      return codes;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [generateRandomCode, handleError]);

  // バックアップコード検証
  const verifyBackupCode = useCallback(async (code: string): Promise<boolean> => {
    if (!auth.currentUser) {
      handleError({ message: 'ユーザーがログインしていません' });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Firebase Firestore/Functions でバックアップコードを検証
      // const isValid = await verifyBackupCodeInFirestore(auth.currentUser.uid, code);
      
      // 仮の実装: ローカル状態で検証
      const foundCode = backupCodes.find(bc => bc.code === code && !bc.used);
      
      if (foundCode) {
        // コードを使用済みにマーク
        const updatedCodes = backupCodes.map(bc => 
          bc.id === foundCode.id 
            ? { ...bc, used: true, usedAt: new Date() }
            : bc
        );
        setBackupCodes(updatedCodes);
        
        // TODO: Firestore でも使用済み状態を更新
        // await markBackupCodeAsUsed(auth.currentUser.uid, foundCode.id);
        
        setMfaVerified(true);
        return true;
      } else {
        throw new Error('無効なバックアップコードです');
      }
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [backupCodes, handleError, setMfaVerified]);

  // 未使用のバックアップコード取得
  const getUnusedCodes = useCallback((): BackupCode[] => {
    return backupCodes.filter(code => !code.used);
  }, [backupCodes]);

  // 使用済みのバックアップコード取得
  const getUsedCodes = useCallback((): BackupCode[] => {
    return backupCodes.filter(code => code.used);
  }, [backupCodes]);

  // バックアップコードをPDFでダウンロード
  const downloadBackupCodes = useCallback((codes: BackupCode[]) => {
    try {
      // セキュアなPDF生成とダウンロード
      const content = generateBackupCodesPDF(codes);
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `workapp-backup-codes-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  // PDF内容生成（簡易版）
  const generateBackupCodesPDF = useCallback((codes: BackupCode[]): string => {
    // TODO: 実際のPDFライブラリ（jsPDF等）を使用してセキュアなPDFを生成
    let content = `WorkApp バックアップコード
生成日: ${new Date().toLocaleDateString('ja-JP')}

重要: これらのコードは安全な場所に保管してください。
各コードは一度だけ使用できます。

バックアップコード:
`;

    codes.forEach((code, index) => {
      content += `${index + 1}. ${code.code}\n`;
    });

    content += `

注意事項:
- これらのコードは多要素認証が利用できない場合の緊急アクセス用です
- 各コードは一度だけ使用できます
- コードを失くした場合は新しいコードを生成してください
- 他人に見せないでください

WorkApp セキュリティチーム
`;

    return content;
  }, []);

  // エラークリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    backupCodes,
    generateBackupCodes,
    verifyBackupCode,
    getUnusedCodes,
    getUsedCodes,
    downloadBackupCodes,
    clearError,
  };
};
