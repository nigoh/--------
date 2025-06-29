/**
 * 拡張経費一覧コンポーネント
 * 
 * employeeRegisterと同様の画面構成
 * - 検索・フィルタリング機能
 * - 詳細表示・編集・削除機能
 * - ページネーション
 * - レスポンシブ対応
 */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  CloudDownload as ExportIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useExpenseStore, ExpenseEntry } from './useExpenseStore';
import { ExpenseModal } from './ExpenseModal';
import ExpenseDialogs from './components/ExpenseDialogs';
import ExpenseListTable from './components/ExpenseListTable';
import SearchField from './components/SearchField';
import ExpenseFilters from './components/ExpenseFilters';
import { surfaceStyles, animations } from '../../theme/componentStyles';
import { spacingTokens } from '../../theme/designSystem';
import { EXPENSE_CATEGORIES, STATUS_CONFIG } from './constants/expenseConstants';

interface ExpenseListFilters {
  search: string;
  category: string;
  status: string;
  minAmount: string;
  maxAmount: string;
  dateFrom: string;
  dateTo: string;
}

export const EnhancedExpenseList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Zustandストア
  const { expenses, deleteExpense } = useExpenseStore();
  
  // モーダル・ダイアログの状態
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseEntry | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseEntry | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseEntry | null>(null);
  
  // フィルター状態
  const [filters, setFilters] = useState<ExpenseListFilters>({
    search: '',
    category: '',
    status: '',
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: '',
  });
  
  // ページネーション状態
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // 成功メッセージ
  const [successMessage, setSuccessMessage] = useState('');

  // フィルタリングされた経費データ
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // 検索フィルター
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          expense.category.toLowerCase().includes(searchTerm) ||
          (expense.note && expense.note.toLowerCase().includes(searchTerm)) ||
          expense.amount.toString().includes(searchTerm);
        if (!matchesSearch) return false;
      }
      
      // カテゴリフィルター
      if (filters.category && expense.category !== filters.category) {
        return false;
      }
      
      // ステータスフィルター
      if (filters.status && expense.status !== filters.status) {
        return false;
      }
      
      // 金額フィルター
      if (filters.minAmount && expense.amount < Number(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && expense.amount > Number(filters.maxAmount)) {
        return false;
      }
      
      // 日付フィルター
      if (filters.dateFrom && expense.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && expense.date > filters.dateTo) {
        return false;
      }
      
      return true;
    });
  }, [expenses, filters]);

  // ページネーション用データ
  const paginatedExpenses = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredExpenses.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredExpenses, page, rowsPerPage]);

  // ユーティリティ関数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  // イベントハンドラー
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPage(0);
  };

  const handleFilterChange = (key: keyof ExpenseListFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      minAmount: '',
      maxAmount: '',
      dateFrom: '',
      dateTo: '',
    });
    setPage(0);
  };

  const handleOpenModal = (expense: ExpenseEntry | null = null) => {
    setExpenseToEdit(expense);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setExpenseToEdit(null);
  };

  const handleViewExpense = (expense: ExpenseEntry) => {
    setSelectedExpense(expense);
  };

  const handleCloseDetail = () => {
    setSelectedExpense(null);
  };

  const handleDeleteExpense = (expense: ExpenseEntry) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      setSuccessMessage('経費を削除しました');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // CSVエクスポート
  const handleExportCSV = () => {
    const csvData = filteredExpenses.map(expense => ({
      日付: formatDate(expense.date),
      カテゴリ: expense.category,
      金額: expense.amount,
      備考: expense.note || '',
      ステータス: STATUS_CONFIG[expense.status]?.label || expense.status,
      領収書件数: expense.receipts.length,
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // アクティブフィルターの数
  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Container maxWidth="xl" sx={{ py: spacingTokens.lg }}>
      {/* ヘッダーセクション */}
      <Paper
        sx={{
          ...surfaceStyles.elevated(1)(theme),
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: spacingTokens.lg,
          mb: spacingTokens.lg,
          ...animations.fadeIn,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={spacingTokens.md}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              💰 経費管理
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
              経費の登録・管理・承認をまとめて行えます
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={spacingTokens.sm} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
              }}
            >
              新規登録
            </Button>
            
            {filteredExpenses.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={handleExportCSV}
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                CSV出力
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* 成功メッセージ */}
      {successMessage && (
        <Fade in={!!successMessage}>
          <Alert severity="success" sx={{ mb: spacingTokens.lg }}>
            {successMessage}
          </Alert>
        </Fade>
      )}

      {/* 検索・フィルターセクション */}
      <Paper sx={{ ...surfaceStyles.surface(theme), p: spacingTokens.lg, mb: spacingTokens.lg }}>
        <ExpenseFilters
          searchQuery={filters.search}
          onSearchChange={handleSearchChange}
          categoryFilter={filters.category}
          statusFilter={filters.status}
          onCategoryChange={(value: string) => handleFilterChange('category', value)}
          onStatusChange={(value: string) => handleFilterChange('status', value)}
          onClearFilters={handleClearFilters}
        />
      </Paper>

      {/* メインコンテンツ */}
      <Box sx={animations.slideUp}>
        {filteredExpenses.length === 0 ? (
          <Paper sx={{ ...surfaceStyles.surface(theme), p: spacingTokens.xxxl, textAlign: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: spacingTokens.md }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {expenses.length === 0 ? 'まだ経費が登録されていません' : 'フィルター条件に一致する経費がありません'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: spacingTokens.lg }}>
              {expenses.length === 0 ? '「新規登録」ボタンから最初の経費を登録してみましょう' : '検索条件を変更してお試しください'}
            </Typography>
            {expenses.length === 0 && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                経費を登録する
              </Button>
            )}
          </Paper>
        ) : (
          <ExpenseListTable
            expenses={filteredExpenses}
            paginated={paginatedExpenses}
            page={page}
            rows={rowsPerPage}
            onPage={handlePageChange}
            onRows={handleRowsPerPageChange}
            onView={handleViewExpense}
            onEdit={handleOpenModal}
            onDelete={handleDeleteExpense}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        )}
      </Box>

      {/* モーダル・ダイアログ */}
      <ExpenseModal
        open={modalOpen}
        onClose={handleCloseModal}
        expense={expenseToEdit}
      />

      <ExpenseDialogs
        selected={selectedExpense}
        onCloseDetail={handleCloseDetail}
        deleteOpen={deleteDialogOpen}
        deleting={expenseToDelete}
        onCancelDelete={handleCancelDelete}
        onConfirmDelete={handleConfirmDelete}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />
    </Container>
  );
};
