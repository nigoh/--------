/**
 * 経費一覧の操作（編集、削除、エクスポート等）を管理するカスタムフック
 */
import { useState } from 'react';
import { ExpenseEntry } from '../useExpenseStore';
import { useExpenseStore } from '../useExpenseStore';
import { useTemporary } from '../../../hooks/useTemporary';
import { CSV_HEADERS } from '../constants/expenseConstants';

export const useExpenseListActions = () => {
  const { deleteExpense } = useExpenseStore();
  const { toast } = useTemporary();

  // モーダル状態
  const [selectedExpense, setSelectedExpense] = useState<ExpenseEntry | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // 展開行の管理
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // メニュー関連
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuExpenseId, setMenuExpenseId] = useState<string | null>(null);

  // モーダル操作
  const handleOpenModal = (expense?: ExpenseEntry) => {
    if (expense) {
      setExpenseToEdit(expense);
    } else {
      setExpenseToEdit(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setExpenseToEdit(null);
  };

  // 詳細表示
  const handleViewDetail = (expense: ExpenseEntry) => {
    setSelectedExpense(expense);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedExpense(null);
  };

  // 行の展開/折りたたみ
  const toggleRowExpansion = (expenseId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(expenseId)) {
        newSet.delete(expenseId);
      } else {
        newSet.add(expenseId);
      }
      return newSet;
    });
  };

  // メニュー操作
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, expenseId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuExpenseId(expenseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuExpenseId(null);
  };

  // 削除処理
  const handleDelete = (expenseId: string) => {
    try {
      deleteExpense(expenseId);
      toast.success('経費を削除しました');
    } catch (error) {
      toast.error('削除に失敗しました');
    }
  };

  // CSV出力
  const handleExportCSV = (expenses: ExpenseEntry[]) => {
    if (expenses.length === 0) {
      toast.warning('エクスポートするデータがありません');
      return;
    }

    try {
      const csvData = expenses.map(expense => ({
        [CSV_HEADERS.date]: expense.date,
        [CSV_HEADERS.category]: expense.category,
        [CSV_HEADERS.amount]: expense.amount,
        [CSV_HEADERS.note]: expense.note || '',
        [CSV_HEADERS.status]: getStatusLabel(expense.status),
        [CSV_HEADERS.submittedDate]: expense.submittedDate ? new Date(expense.submittedDate).toLocaleDateString() : '',
        [CSV_HEADERS.approvedDate]: expense.approvedDate ? new Date(expense.approvedDate).toLocaleDateString() : '',
        [CSV_HEADERS.settledDate]: expense.settledDate ? new Date(expense.settledDate).toLocaleDateString() : '',
      }));

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success('CSVファイルをダウンロードしました');
    } catch (error) {
      toast.error('CSV出力に失敗しました');
    }
  };

  // ステータスラベル取得（定数から取得するヘルパー）
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: '申請中',
      approved: '承認済み',
      rejected: '却下',
      settled: '清算済み',
    };
    return statusMap[status] || status;
  };

  return {
    // 状態
    selectedExpense,
    expenseToEdit,
    modalOpen,
    detailModalOpen,
    expandedRows,
    anchorEl,
    menuExpenseId,
    
    // 操作関数
    handleOpenModal,
    handleCloseModal,
    handleViewDetail,
    handleCloseDetailModal,
    toggleRowExpansion,
    handleMenuOpen,
    handleMenuClose,
    handleDelete,
    handleExportCSV,
  };
};
