/**
 * 社員一覧操作のカスタムフック
 * 
 * 社員の詳細表示、削除、ステータス変更などの操作機能を分離し、
 * UIコンポーネントから独立したビジネスロジックを提供
 */
import { useState } from 'react';
import { Employee, useEmployeeStore } from '../useEmployeeStore';
import { useTemporary } from '../../../hooks/useTemporary';

/**
 * 社員一覧操作のカスタムフック
 */
export const useEmployeeListActions = () => {
  const { deleteEmployee, toggleEmployeeStatus } = useEmployeeStore();
  const { toast, progress, clipboard } = useTemporary();
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  /**
   * 社員詳細表示
   */
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  /**
   * 社員詳細ダイアログを閉じる
   */
  const handleCloseDetail = () => {
    setSelectedEmployee(null);
  };

  /**
   * 削除確認ダイアログを開く
   */
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteConfirmOpen(true);
  };

  /**
   * 削除実行
   */
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    progress.start('社員情報を削除中...', 1);
    
    try {
      // 擬似的な遅延（API呼び出しの模擬）
      await new Promise(resolve => setTimeout(resolve, 800));
      
      deleteEmployee(employeeToDelete.id);
      progress.complete();
      toast.success(`${employeeToDelete.name}さんの情報を削除しました`);
      
    } catch (error) {
      console.error('Delete error:', error);
      progress.complete();
      toast.error('削除に失敗しました。もう一度お試しください。');
    } finally {
      // ダイアログを閉じる
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
    }
  };

  /**
   * 削除キャンセル
   */
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setEmployeeToDelete(null);
  };

  /**
   * 社員ステータス切り替え（在籍/退職）
   */
  const handleToggleStatus = async (employee: Employee) => {
    const newStatus = !employee.isActive;
    const statusText = newStatus ? '在籍' : '退職';
    
    progress.start(`${employee.name}さんのステータスを更新中...`, 0.5);
    
    try {
      // 擬似的な遅延
      await new Promise(resolve => setTimeout(resolve, 600));
      
      toggleEmployeeStatus(employee.id);
      progress.complete();
      toast.success(`${employee.name}さんのステータスを「${statusText}」に変更しました`);
      
    } catch (error) {
      console.error('Status toggle error:', error);
      progress.complete();
      toast.error('ステータスの変更に失敗しました。');
    }
  };

  /**
   * メールアドレスをクリップボードにコピー
   */
  const handleCopyEmail = (email: string, name: string) => {
    clipboard.copy(email);
    toast.success(`${name}さんのメールアドレスをコピーしました`);
  };

  /**
   * 社員情報をCSV形式でエクスポート（将来の拡張用）
   */
  const handleExportEmployee = (employee: Employee) => {
    const csvData = [
      ['項目', '値'],
      ['名前', employee.name],
      ['メール', employee.email],
      ['電話', employee.phone],
      ['部署', employee.department],
      ['役職', employee.position],
      ['スキル', employee.skills.join(', ')],
      ['入社日', employee.joinDate],
      ['ステータス', employee.isActive ? '在籍' : '退職'],
      ['備考', employee.notes || ''],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${employee.name}_社員情報.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${employee.name}さんの情報をエクスポートしました`);
    }
  };

  /**
   * 日付フォーマット用ヘルパー関数
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return {
    // 状態
    selectedEmployee,
    deleteConfirmOpen,
    employeeToDelete,
    
    // 詳細表示
    handleViewEmployee,
    handleCloseDetail,
    
    // 削除操作
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    
    // ステータス操作
    handleToggleStatus,
    
    // その他の操作
    handleCopyEmail,
    handleExportEmployee,
    
    // ユーティリティ
    formatDate,
  };
};

export default useEmployeeListActions;
