import { useCallback } from 'react';
import { useExpenseStore, ExpenseStatus } from '../useExpenseStore';
import { useExpenseFormStore } from '../stores/useExpenseFormStore';
import { useBusinessLoggers } from '../../../hooks/logging';
import { useTemporary } from '../../../hooks/useTemporary';

/**
 * 経費フォーム管理用カスタムフック
 * Zustandストアとビジネスロジックを統合
 */
export const useExpenseForm = (onMessage?: (message: string, type: 'success' | 'error') => void) => {
  // ストアのアクション
  const { addExpense, updateExpense } = useExpenseStore();
  const { toast, progress } = useTemporary();
  const { featureLogger, crudLogger, searchLogger } = useBusinessLoggers('ExpenseManagement');
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
      
      // 送信開始ログ
      featureLogger.logUserAction('expense_form_submit_attempt', {
        isEdit: !!editingExpense,
        category: formData.category,
        amount: Number(formData.amount),
        hasNote: !!formData.note.trim()
      });

      progress.start(editingExpense ? '経費を更新中...' : '経費を登録中...', 1);
      
      // バリデーション
      if (!validateForm()) {
        // バリデーションエラーログ
        crudLogger.logValidationError(errors, {
          isEdit: !!editingExpense,
          formData: {
            category: formData.category,
            amount: formData.amount,
            hasNote: !!formData.note.trim()
          }
        });
        
        showMessage('入力内容に不備があります', 'error');
        progress.error();
        setTimeout(() => progress.clear(), 2000);
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
        
        // CRUD更新ログ
        await crudLogger.logUpdate('expense', editingExpense.id, expenseData, {
          category: expenseData.category,
          amount: expenseData.amount,
          amountRange: getAmountRange(expenseData.amount),
          hasNote: !!expenseData.note
        });
        
        // 成功ログ
        featureLogger.logUserAction('expense_update_success', {
          expenseId: editingExpense.id,
          category: expenseData.category,
          amount: expenseData.amount
        });
        
        showMessage('経費を更新しました', 'success');
        toast.success('経費を更新しました');
      } else {
        // 新規作成
        const expenseId = addExpense(expenseData);
        
        // CRUD作成ログ
        await crudLogger.logCreate('expense', { ...expenseData, id: expenseId }, {
          category: expenseData.category,
          amount: expenseData.amount,
          amountRange: getAmountRange(expenseData.amount),
          hasNote: !!expenseData.note
        });
        
        // 成功ログ
        featureLogger.logUserAction('expense_create_success', {
          expenseId: expenseId,
          category: expenseData.category,
          amount: expenseData.amount
        });
        
        showMessage('経費を登録しました', 'success');
        toast.success(`経費（${expenseData.amount.toLocaleString()}円）を登録しました`);
      }

      progress.complete();
      resetForm();
      setTimeout(() => progress.clear(), 1000);
      return true;
    } catch (error) {
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Expense form submit failed'), {
        action: editingExpense ? 'expense_update' : 'expense_create',
        category: formData.category,
        amount: formData.amount
      });
      
      progress.error();
      console.error('経費保存エラー:', error);
      showMessage('保存に失敗しました', 'error');
      toast.error('保存に失敗しました');
      setTimeout(() => progress.clear(), 2000);
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
    featureLogger,
    crudLogger,
    toast,
    progress,
    errors,
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

/**
 * 金額範囲の取得
 */
function getAmountRange(amount: number): string {
  if (amount < 1000) return '< 1,000円';
  if (amount < 5000) return '1,000-5,000円';
  if (amount < 10000) return '5,000-10,000円';
  if (amount < 50000) return '10,000-50,000円';
  if (amount < 100000) return '50,000-100,000円';
  return '> 100,000円';
}
