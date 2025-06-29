import { useCallback } from 'react';
import { useExpenseStore, ExpenseStatus } from '../useExpenseStore';
import { useExpenseFormStore } from '../stores/useExpenseFormStore';

/**
 * 経費フォーム管理用カスタムフック
 * Zustandストアとビジネスロジックを統合
 */
export const useExpenseForm = (onMessage?: (message: string, type: 'success' | 'error') => void) => {
  // ストアのアクション
  const { addExpense, updateExpense } = useExpenseStore();
  const {
    formData,
    errors,
    isSubmitting,
    isLoading,
    editingExpense,
    setFormData,
    updateField,
    setErrors,
    clearErrors,
    setSubmitting,
    setLoading,
    setEditingExpense,
    resetForm,
    validateForm,
    populateFormFromExpense,
  } = useExpenseFormStore();

  // メッセージ表示ヘルパー
  const showMessage = useCallback((message: string, type: 'success' | 'error') => {
    if (onMessage) {
      onMessage(message, type);
    }
  }, [onMessage]);

  // フィールド更新ハンドラー
  const handleFieldChange = useCallback((field: string, value: string | File[]) => {
    updateField(field as any, value);
  }, [updateField]);

  // フォーム送信ハンドラー
  const handleSubmit = useCallback(async () => {
    try {
      setSubmitting(true);
      
      // バリデーション
      if (!validateForm()) {
        showMessage('入力内容に不備があります', 'error');
        return false;
      }

      // データ変換
      const expenseData = {
        date: formData.date,
        category: formData.category,
        amount: Number(formData.amount),
        note: formData.note.trim() || undefined,
      };

      if (editingExpense) {
        // 更新
        updateExpense(editingExpense.id, expenseData);
        showMessage('経費を更新しました', 'success');
      } else {
        // 新規作成
        addExpense(expenseData);
        showMessage('経費を登録しました', 'success');
      }

      resetForm();
      return true;
    } catch (error) {
      console.error('経費保存エラー:', error);
      showMessage('保存に失敗しました', 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [
    formData,
    editingExpense,
    validateForm,
    addExpense,
    updateExpense,
    resetForm,
    setSubmitting,
    showMessage,
  ]);

  // 編集モード開始
  const startEdit = useCallback((expense: any) => {
    populateFormFromExpense(expense);
  }, [populateFormFromExpense]);

  // 編集キャンセル
  const cancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  // フィールドエラー取得
  const getFieldError = useCallback((field: string) => {
    return errors[field as keyof typeof errors];
  }, [errors]);

  // フォームの有効性チェック
  const isFormValid = useCallback(() => {
    return Object.keys(errors).length === 0 && 
           formData.date && 
           formData.category && 
           formData.amount;
  }, [errors, formData]);

  return {
    // フォームデータ
    formData,
    errors,
    isSubmitting,
    isLoading,
    editingExpense,
    
    // 状態チェック
    isEditing: !!editingExpense,
    isFormValid: isFormValid(),
    
    // アクション
    handleFieldChange,
    handleSubmit,
    startEdit,
    cancelEdit,
    resetForm,
    clearErrors,
    getFieldError,
    
    // 直接アクセス（必要に応じて）
    setFormData,
    setLoading,
    validateForm,
  };
};

/**
 * 経費リスト操作用カスタムフック
 */
export const useExpenseList = (onMessage?: (message: string, type: 'success' | 'error') => void) => {
  const { 
    expenses, 
    deleteExpense, 
    updateStatus,
    addReceipt,
    removeReceipt,
  } = useExpenseStore();

  // メッセージ表示ヘルパー
  const showMessage = useCallback((message: string, type: 'success' | 'error') => {
    if (onMessage) {
      onMessage(message, type);
    }
  }, [onMessage]);

  // 削除ハンドラー
  const handleDelete = useCallback(async (id: string) => {
    try {
      deleteExpense(id);
      showMessage('経費を削除しました', 'success');
      return true;
    } catch (error) {
      console.error('削除エラー:', error);
      showMessage('削除に失敗しました', 'error');
      return false;
    }
  }, [deleteExpense, showMessage]);

  // ステータス更新ハンドラー
  const handleStatusUpdate = useCallback(async (
    id: string, 
    status: ExpenseStatus, 
    metadata?: { approvedBy?: string; rejectionReason?: string }
  ) => {
    try {
      updateStatus(id, status, metadata);
      const statusTextMap: Record<ExpenseStatus, string> = {
        pending: '申請中',
        approved: '承認済み',
        rejected: '却下',
        settled: '精算済み',
      };
      const statusText = statusTextMap[status] || status;
      
      showMessage(`ステータスを「${statusText}」に更新しました`, 'success');
      return true;
    } catch (error) {
      console.error('ステータス更新エラー:', error);
      showMessage('ステータス更新に失敗しました', 'error');
      return false;
    }
  }, [updateStatus, showMessage]);

  // 領収書追加ハンドラー
  const handleAddReceipt = useCallback(async (
    expenseId: string, 
    receipt: { filename: string; fileUrl: string; fileSize: number }
  ) => {
    try {
      addReceipt(expenseId, receipt);
      showMessage('領収書を追加しました', 'success');
      return true;
    } catch (error) {
      console.error('領収書追加エラー:', error);
      showMessage('領収書の追加に失敗しました', 'error');
      return false;
    }
  }, [addReceipt, showMessage]);

  // 領収書削除ハンドラー
  const handleRemoveReceipt = useCallback(async (expenseId: string, receiptId: string) => {
    try {
      removeReceipt(expenseId, receiptId);
      showMessage('領収書を削除しました', 'success');
      return true;
    } catch (error) {
      console.error('領収書削除エラー:', error);
      showMessage('領収書の削除に失敗しました', 'error');
      return false;
    }
  }, [removeReceipt, showMessage]);

  return {
    expenses,
    handleDelete,
    handleStatusUpdate,
    handleAddReceipt,
    handleRemoveReceipt,
  };
};
