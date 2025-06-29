import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, Stack, Box, TablePagination, Paper, Typography } from '@mui/material';
import { Delete, Visibility, AttachMoney, Receipt } from '@mui/icons-material';
import { ExpenseEntry } from '../useExpenseStore';

interface Props {
  expenses: ExpenseEntry[];
  paginated: ExpenseEntry[];
  page: number;
  rows: number;
  onPage: (e: unknown, p: number) => void;
  onRows: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onView: (e: ExpenseEntry) => void;
  onEdit: (e: ExpenseEntry) => void;
  onDelete: (e: ExpenseEntry) => void;
  formatDate: (d: string) => string;
  formatCurrency: (amount: number) => string;
}

const ExpenseListTable: React.FC<Props> = (p) => (
  <>
    <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 1 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(102,126,234,0.1)' }}>
            {['日付', 'カテゴリ', '金額', '備考', 'ステータス', '領収書', '操作'].map((h) => (
              <TableCell key={h} align={h === '操作' || h === '金額' ? 'center' : 'left'}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {p.paginated.map((expense) => (
            <TableRow 
              key={expense.id} 
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }, 
                opacity: expense.status === 'rejected' ? 0.6 : 1 
              }}
            >
              <TableCell>{p.formatDate(expense.date)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney fontSize="small" color="primary" />
                  <span style={{ fontWeight: 'bold' }}>{expense.category}</span>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {p.formatCurrency(expense.amount)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    maxWidth: 150, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}
                  title={expense.note || ''}
                >
                  {expense.note || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={
                    expense.status === 'approved' ? '承認済み' : 
                    expense.status === 'pending' ? '承認待ち' : 
                    expense.status === 'settled' ? '精算済み' : '却下'
                  } 
                  color={
                    expense.status === 'approved' ? 'success' : 
                    expense.status === 'pending' ? 'warning' : 
                    expense.status === 'settled' ? 'info' : 'error'
                  } 
                  size="small" 
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Receipt fontSize="small" color={expense.receipts.length > 0 ? 'primary' : 'disabled'} />
                  <Typography variant="caption">
                    {expense.receipts.length}件
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={0.5} justifyContent="center">
                  <Tooltip title="詳細表示">
                    <IconButton size="small" onClick={() => p.onView(expense)} sx={{ color: 'primary.main' }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="編集">
                    <IconButton 
                      size="small" 
                      onClick={() => p.onEdit(expense)} 
                      sx={{ color: 'warning.main' }}
                      disabled={expense.status === 'approved' || expense.status === 'settled'}
                    >
                      <AttachMoney fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="削除">
                    <IconButton 
                      size="small" 
                      onClick={() => p.onDelete(expense)} 
                      sx={{ color: 'error.main' }}
                      disabled={expense.status === 'approved' || expense.status === 'settled'}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination 
      component="div" 
      count={p.expenses.length} 
      page={p.page} 
      onPageChange={p.onPage} 
      rowsPerPage={p.rows} 
      onRowsPerPageChange={p.onRows} 
      rowsPerPageOptions={[5, 10, 25, 50]} 
      labelRowsPerPage="表示件数:" 
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}件`} 
      sx={{ 
        mt: 1.5, 
        '& .MuiTablePagination-toolbar': { 
          backgroundColor: 'rgba(255,255,255,0.8)', 
          borderRadius: 1 
        } 
      }} 
    />
  </>
);

export default ExpenseListTable;
