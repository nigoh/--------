import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Chip,
  Tabs,
  Tab,
  Collapse,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useExpenseStore, ExpenseStatus } from './useExpenseStore';
import { StatusManager } from './StatusManager';
import { ReceiptUpload } from './ReceiptUpload';

interface EditForm {
  date: string;
  category: string;
  amount: number;
  note?: string;
}

export const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense, updateExpense } = useExpenseStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'all'>('all');
  const [form, setForm] = useState<EditForm>({
    date: '',
    category: '',
    amount: 0,
    note: '',
  });

  const openEdit = (id: string) => {
    const entry = expenses.find((e) => e.id === id);
    if (!entry) return;
    setForm({
      date: entry.date,
      category: entry.category,
      amount: entry.amount,
      note: entry.note ?? '',
    });
    setEditingId(id);
  };

  const closeEdit = () => setEditingId(null);

  const handleSave = () => {
    if (!editingId) return;
    updateExpense(editingId, form);
    closeEdit();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // ステータスでフィルタリング
  const filteredExpenses = expenses.filter(expense => 
    statusFilter === 'all' || expense.status === statusFilter
  );

  // ステータス別の件数を計算
  const statusCounts = {
    all: expenses.length,
    pending: expenses.filter(e => e.status === 'pending').length,
    approved: expenses.filter(e => e.status === 'approved').length,
    rejected: expenses.filter(e => e.status === 'rejected').length,
    settled: expenses.filter(e => e.status === 'settled').length,
  };

  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

  const getStatusLabel = (status: ExpenseStatus) => {
    const labels = {
      pending: '申請中',
      approved: '承認済み',
      rejected: '却下',
      settled: '清算済み',
    };
    return labels[status];
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        経費一覧
      </Typography>

      {/* ステータスフィルター */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={statusFilter} 
          onChange={(_, newValue) => setStatusFilter(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label={`全て (${statusCounts.all})`} 
            value="all" 
          />
          <Tab 
            label={`申請中 (${statusCounts.pending})`} 
            value="pending" 
          />
          <Tab 
            label={`承認済み (${statusCounts.approved})`} 
            value="approved" 
          />
          <Tab 
            label={`却下 (${statusCounts.rejected})`} 
            value="rejected" 
          />
          <Tab 
            label={`清算済み (${statusCounts.settled})`} 
            value="settled" 
          />
        </Tabs>
      </Box>

      {filteredExpenses.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          {statusFilter === 'all' ? 'まだ登録がありません' : `${getStatusLabel(statusFilter as ExpenseStatus)}の経費はありません`}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <TableCell>日付</TableCell>
                <TableCell>カテゴリ</TableCell>
                <TableCell align="right">金額</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell align="center">領収書</TableCell>
                <TableCell>備考</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((entry) => (
                <React.Fragment key={entry.id}>
                  <TableRow>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusManager
                        expenseId={entry.id}
                        currentStatus={entry.status}
                        disabled={entry.status === 'settled'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={<ReceiptIcon />}
                          label={entry.receipts.length}
                          size="small"
                          color={entry.receipts.length > 0 ? 'success' : 'default'}
                          variant={entry.receipts.length > 0 ? 'filled' : 'outlined'}
                        />
                        {entry.receipts.length > 0 && (
                          <IconButton
                            size="small"
                            onClick={() => toggleExpand(entry.id)}
                          >
                            {expandedId === entry.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {entry.note}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => openEdit(entry.id)}
                        disabled={entry.status === 'settled'}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => deleteExpense(entry.id)}
                        disabled={entry.status !== 'pending'}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  
                  {/* 領収書詳細表示 */}
                  <TableRow>
                    <TableCell sx={{ py: 0 }} colSpan={7}>
                      <Collapse in={expandedId === entry.id} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2 }}>
                          <ReceiptUpload
                            expenseId={entry.id}
                            receipts={entry.receipts}
                            disabled={entry.status === 'settled'}
                          />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 編集ダイアログ */}
      <Dialog open={!!editingId} onClose={closeEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>経費編集</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="日付"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="カテゴリ"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              select
              slotProps={{
                select: {
                  MenuProps: {
                    TransitionProps: {
                      timeout: 150,
                    },
                  },
                }
              }}
            >
              {['交通費', '宿泊費', '会議費', '接待費', '通信費', '消耗品費', 'その他'].map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="金額"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
            <TextField
              label="備考"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} variant="outlined">
            キャンセル
          </Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
