import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  Box,
  Typography,
  TablePagination,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PersonOff as PersonOffIcon,
  Person as PersonIcon,
  TableSortLabel,
} from '@mui/icons-material';
import { spacingTokens } from '../../../theme/designSystem';
import { Employee } from '../useEmployeeStore';

export type SortField = keyof Employee;

interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

interface EmployeeTableProps {
  employees: Employee[];
  paginatedEmployees: Employee[];
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  isMobile: boolean;
  getInitials: (name: string) => string;
  formatDate: (d: string) => string;
  onView: (e: Employee) => void;
  onEdit: (e: Employee) => void;
  onToggleStatus: (e: Employee) => void;
  onDelete: (e: Employee) => void;
  onCopyEmail: (email: string, name: string) => void;
  filteredCount: number;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  paginatedEmployees,
  sortConfig,
  onSort,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  isMobile,
  getInitials,
  formatDate,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  onCopyEmail,
  filteredCount,
}) => {
  const theme = useTheme();
  return (
    <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {employees.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: spacingTokens.sm }}>
            まだ社員が登録されていません
          </Typography>
          <Typography variant="body2" sx={{ mb: spacingTokens.lg }}>
            「社員登録」ボタンから新しい社員を登録してください
          </Typography>
        </Box>
      ) : filteredCount === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: spacingTokens.sm }}>
            検索条件に一致する社員が見つかりません
          </Typography>
          <Typography variant="body2">検索条件やフィルターを変更してみてください</Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.field === 'name'}
                      direction={sortConfig.field === 'name' ? sortConfig.direction : 'asc'}
                      onClick={() => onSort('name')}
                    >
                      社員
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.field === 'department'}
                      direction={sortConfig.field === 'department' ? sortConfig.direction : 'asc'}
                      onClick={() => onSort('department')}
                    >
                      部署
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.field === 'position'}
                      direction={sortConfig.field === 'position' ? sortConfig.direction : 'asc'}
                      onClick={() => onSort('position')}
                    >
                      役職
                    </TableSortLabel>
                  </TableCell>
                  {!isMobile && <TableCell>スキル</TableCell>}
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.field === 'joinDate'}
                      direction={sortConfig.field === 'joinDate' ? sortConfig.direction : 'asc'}
                      onClick={() => onSort('joinDate')}
                    >
                      入社日
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.field === 'isActive'}
                      direction={sortConfig.field === 'isActive' ? sortConfig.direction : 'asc'}
                      onClick={() => onSort('isActive')}
                    >
                      ステータス
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id} sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }, opacity: employee.isActive ? 1 : 0.6 }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                        <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)` }}>
                          {getInitials(employee.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                            {employee.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                            onClick={() => onCopyEmail(employee.email, employee.name)}
                            title="クリックでコピー"
                          >
                            {employee.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 180 }}>
                          {employee.skills.slice(0, 2).map((skill) => (
                            <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                          ))}
                          {employee.skills.length > 2 && (
                            <Chip label={`+${employee.skills.length - 2}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                          )}
                        </Box>
                      </TableCell>
                    )}
                    <TableCell>{formatDate(employee.joinDate)}</TableCell>
                    <TableCell>
                      <Chip label={employee.isActive ? '在籍' : '退職'} color={employee.isActive ? 'success' : 'default'} size="small" icon={employee.isActive ? <PersonIcon /> : <PersonOffIcon />} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="詳細表示">
                          <IconButton size="small" onClick={() => onView(employee)} sx={{ color: 'primary.main' }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="編集">
                          <IconButton size="small" onClick={() => onEdit(employee)} sx={{ color: 'info.main' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={employee.isActive ? '退職にする' : '復職にする'}>
                          <IconButton size="small" onClick={() => onToggleStatus(employee)} sx={{ color: employee.isActive ? 'warning.main' : 'success.main' }}>
                            {employee.isActive ? <PersonOffIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="削除">
                          <IconButton size="small" onClick={() => onDelete(employee)} sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" />
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
            count={filteredCount}
            page={page}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="表示件数:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}件`}
            sx={{ borderTop: 1, borderColor: 'divider', '& .MuiTablePagination-toolbar': { minHeight: 48 } }}
          />
        </>
      )}
    </Paper>
  );
};

export default EmployeeTable;
