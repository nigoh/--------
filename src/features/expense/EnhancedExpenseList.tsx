/**
 * 拡張経費一覧コンポーネント
 * 
 * ソート、フィルタリング、CSV出力、ステータス管理機能を含む経費一覧
 * Material Design 3準拠のコンパクトデザイン
 */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  Paper,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Collapse,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useExpenseStore, ExpenseEntry, ExpenseStatus } from './useExpenseStore';
import { ExpenseModal } from './ExpenseModal';
import { StatusManager } from './StatusManager';
import { ReceiptUpload } from './ReceiptUpload';
import { surfaceStyles } from '../../theme/componentStyles';
import { spacingTokens } from '../../theme/designSystem';

// ソート関連の型定義
type SortField = 'date' | 'category' | 'amount' | 'status' | 'submittedDate';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// ステータス表示設定
const statusConfig = {
  pending: { label: '申請中', color: 'warning' as const },
  approved: { label: '承認済み', color: 'success' as const },
  rejected: { label: '却下', color: 'error' as const },
  settled: { label: '清算済み', color: 'info' as const },
};

/**
 * 拡張経費一覧コンポーネント
 */
export const EnhancedExpenseList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { expenses, deleteExpense } = useExpenseStore();

  // 状態管理
  const [selectedExpense, setSelectedExpense] = useState<ExpenseEntry | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc',
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // メニュー関連
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuExpenseId, setMenuExpenseId] = useState<string | null>(null);

  // カテゴリの一覧を取得
  const categories = useMemo(() => {
    const categorySet = new Set(expenses.map(expense => expense.category));
    return Array.from(categorySet).sort();
  }, [expenses]);

  // フィルタリングとソート処理
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = searchQuery === '' || 
        (expense.note || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === '' || expense.category === categoryFilter;
      const matchesStatus = statusFilter === '' || expense.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // ソート処理
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.field];
      let bValue: any = b[sortConfig.field];

      if (sortConfig.field === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortConfig.field === 'date' || sortConfig.field === 'submittedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [expenses, searchQuery, categoryFilter, statusFilter, sortConfig]);

  // ページネーション処理
  const paginatedExpenses = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedExpenses.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedExpenses, page, rowsPerPage]);

  // ソート処理
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
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

  // メニュー操作
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, expenseId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuExpenseId(expenseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuExpenseId(null);
  };

  // CSV出力
  const handleExportCSV = () => {
    const csvData = filteredAndSortedExpenses.map(expense => ({
      日付: expense.date,
      カテゴリ: expense.category,
      金額: expense.amount,
      備考: expense.note,
      ステータス: statusConfig[expense.status].label,
      申請日: expense.submittedDate ? new Date(expense.submittedDate).toLocaleDateString() : '',
      承認日: expense.approvedDate ? new Date(expense.approvedDate).toLocaleDateString() : '',
      清算日: expense.settledDate ? new Date(expense.settledDate).toLocaleDateString() : '',
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダーツールバー */}
      <Paper
        elevation={1}
        sx={{
          ...surfaceStyles.surface(theme),
          mb: spacingTokens.md,
          flexShrink: 0,
        }}
      >
        <Toolbar sx={{ py: spacingTokens.sm }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            経費一覧 ({filteredAndSortedExpenses.length}件)
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              size="small"
            >
              新規登録
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportCSV}
              size="small"
            >
              CSV出力
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* フィルターエリア */}
      <Paper
        elevation={1}
        sx={{
          ...surfaceStyles.surface(theme),
          mb: spacingTokens.md,
          flexShrink: 0,
        }}
      >
        <Box sx={{ p: spacingTokens.md }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              placeholder="備考・カテゴリで検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              size="small"
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="カテゴリ"
              >
                <MenuItem value="">すべて</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="ステータス"
              >
                <MenuItem value="">すべて</MenuItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <MenuItem key={status} value={status}>
                    {config.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Paper>

      {/* テーブル */}
      <Paper
        elevation={1}
        sx={{
          ...surfaceStyles.surface(theme),
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell width={40}></TableCell>
                <TableCell
                  sortDirection={sortConfig.field === 'date' ? sortConfig.direction : false}
                  onClick={() => handleSort('date')}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                >
                  日付
                </TableCell>
                <TableCell
                  sortDirection={sortConfig.field === 'category' ? sortConfig.direction : false}
                  onClick={() => handleSort('category')}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                >
                  カテゴリ
                </TableCell>
                <TableCell
                  sortDirection={sortConfig.field === 'amount' ? sortConfig.direction : false}
                  onClick={() => handleSort('amount')}
                  sx={{ cursor: 'pointer', fontWeight: 600, textAlign: 'right' }}
                >
                  金額
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>備考</TableCell>
                <TableCell
                  sortDirection={sortConfig.field === 'status' ? sortConfig.direction : false}
                  onClick={() => handleSort('status')}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                >
                  ステータス
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>領収書</TableCell>
                <TableCell width={60}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <React.Fragment key={expense.id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(expense.id)}
                      >
                        {expandedRows.has(expense.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell align="right">
                      ¥{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {expense.note || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[expense.status].label}
                        color={statusConfig[expense.status].color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {expense.receipts.length > 0 && (
                        <Chip
                          icon={<ReceiptIcon />}
                          label={expense.receipts.length}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, expense.id)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  
                  {/* 展開可能な詳細行 */}
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      sx={{ py: 0, border: 0 }}
                    >
                      <Collapse in={expandedRows.has(expense.id)}>
                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                          <Stack spacing={2}>
                            {/* ステータス管理 */}
                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                ステータス管理
                              </Typography>
                              <StatusManager
                                expenseId={expense.id}
                                currentStatus={expense.status}
                              />
                            </Box>
                            
                            {/* 領収書管理 */}
                            {expense.receipts.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                  領収書 ({expense.receipts.length}件)
                                </Typography>
                                <ReceiptUpload
                                  expenseId={expense.id}
                                  receipts={expense.receipts}
                                  disabled={expense.status === 'settled'}
                                />
                              </Box>
                            )}
                          </Stack>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ページネーション */}
        <TablePagination
          component="div"
          count={filteredAndSortedExpenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="表示件数:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}件`}
        />
      </Paper>

      {/* コンテキストメニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const expense = expenses.find(e => e.id === menuExpenseId);
            if (expense) {
              handleViewDetail(expense);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>詳細表示</ListItemText>
        </MenuItem>
        
        <MenuItem
          onClick={() => {
            const expense = expenses.find(e => e.id === menuExpenseId);
            if (expense) {
              handleOpenModal(expense);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>編集</ListItemText>
        </MenuItem>
        
        <MenuItem
          onClick={() => {
            if (menuExpenseId) {
              deleteExpense(menuExpenseId);
            }
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      </Menu>

      {/* 経費登録・編集モーダル */}
      <ExpenseModal
        open={modalOpen}
        onClose={handleCloseModal}
        expense={expenseToEdit}
      />
    </Box>
  );
};
