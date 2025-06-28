/**
 * 拡張社員一覧コンポーネント
 * 
 * ソート、フィルタリング、CSVエクスポート機能を含む社員一覧
 * Material Design 3準拠のコンパクトデザイン
 */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Stack,
  Tooltip,
  Avatar,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
  useTheme,
  Fab,
  Collapse,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonOff as PersonOffIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useEmployeeStore, Employee } from './useEmployeeStore';
import { useTemporary } from '../../hooks/useTemporary';
import { EmployeeModal } from './EmployeeModal';
import { surfaceStyles } from '../../theme/componentStyles';
import { spacingTokens } from '../../theme/designSystem';

// ソート方向の型定義
type SortDirection = 'asc' | 'desc';
type SortField = keyof Employee;

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * 拡張社員一覧コンポーネント
 */
export const EnhancedEmployeeList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { employees, deleteEmployee, toggleEmployeeStatus } = useEmployeeStore();
  const { toast, progress, clipboard } = useTemporary();

  // 状態管理
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc',
  });

  // 部署の一覧を取得
  const departments = useMemo(() => {
    const deptSet = new Set(employees.map(emp => emp.department));
    return Array.from(deptSet).sort();
  }, [employees]);

  // フィルタリングとソート
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = (
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' ? employee.isActive : !employee.isActive);
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // ソート
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.field];
      const bVal = b[sortConfig.field];
      
      // undefined値の処理
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;
      
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [employees, searchQuery, departmentFilter, statusFilter, sortConfig]);

  // ページネーション用データ
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /**
   * ソート処理
   */
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  /**
   * フィルターをクリア
   */
  const clearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('');
    setStatusFilter('');
  };

  /**
   * CSVエクスポート
   */
  const exportToCSV = () => {
    const headers = ['氏名', '部署', '役職', 'メール', '電話', '入社日', 'ステータス', 'スキル'];
    const csvData = filteredAndSortedEmployees.map(emp => [
      emp.name,
      emp.department,
      emp.position,
      emp.email,
      emp.phone || '',
      emp.joinDate,
      emp.isActive ? '在籍' : '退職',
      emp.skills.join(';'),
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `社員一覧_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSVファイルをダウンロードしました');
  };

  /**
   * 新規登録
   */
  const handleAddEmployee = () => {
    setEmployeeToEdit(null);
    setModalOpen(true);
  };

  /**
   * 編集
   */
  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setModalOpen(true);
  };

  /**
   * 社員詳細表示
   */
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailModalOpen(true);
  };

  /**
   * 削除処理
   */
  const handleDeleteEmployee = async (employee: Employee) => {
    const confirmed = window.confirm(`本当に「${employee.name}」を削除しますか？\nこの操作は取り消せません。`);
    if (!confirmed) return;

    progress.start('社員情報を削除中...', 1);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      deleteEmployee(employee.id);
      progress.complete();
      toast.success(`${employee.name}さんの情報を削除しました`);
      
      setTimeout(() => progress.clear(), 1000);
    } catch (err) {
      progress.error();
      toast.error('削除に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  };

  /**
   * ステータス切り替え
   */
  const handleToggleStatus = (employee: Employee) => {
    toggleEmployeeStatus(employee.id);
    const newStatus = employee.isActive ? '無効' : '有効';
    toast.info(`${employee.name}さんのステータスを${newStatus}に変更しました`);
  };

  /**
   * メールアドレスをコピー
   */
  const handleCopyEmail = (email: string, employeeName: string) => {
    clipboard.copy(email);
    toast.success(`${employeeName}さんのメールアドレスをコピーしました`);
  };

  /**
   * 社員名の初期文字を取得
   */
  const getInitials = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  /**
   * 日付をフォーマット
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー */}
      <Paper 
        sx={{ 
          ...surfaceStyles.elevated(1)(theme),
          p: spacingTokens.md,
          mb: spacingTokens.md,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: spacingTokens.sm,
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            社員一覧 ({filteredAndSortedEmployees.length}人)
          </Typography>
          
          <Stack direction="row" spacing={spacingTokens.sm}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToCSV}
              size="small"
              disabled={filteredAndSortedEmployees.length === 0}
            >
              CSV出力
            </Button>
            
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddEmployee}
              size="small"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              }}
            >
              社員登録
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* 検索・フィルター */}
      <Paper 
        sx={{ 
          ...surfaceStyles.elevated(1)(theme),
          p: spacingTokens.md,
          mb: spacingTokens.md,
        }}
      >
        <Stack spacing={spacingTokens.md}>
          {/* 検索フィールド */}
          <TextField
            fullWidth
            placeholder="社員名、部署、役職、メール、スキルで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ maxWidth: 500 }}
          />

          {/* 詳細フィルター */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
            <Button
              variant="text"
              startIcon={filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              size="small"
            >
              詳細フィルター
            </Button>
            {(departmentFilter || statusFilter) && (
              <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
                color="warning"
              >
                フィルタークリア
              </Button>
            )}
          </Box>

          <Collapse in={filtersExpanded}>
            <Box sx={{ 
              display: 'flex', 
              gap: spacingTokens.md,
              flexDirection: { xs: 'column', sm: 'row' },
              maxWidth: 600,
            }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>部署</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="部署"
                >
                  <MenuItem value="">すべて</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>ステータス</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="ステータス"
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="active">在籍中</MenuItem>
                  <MenuItem value="inactive">退職済み</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Collapse>
        </Stack>
      </Paper>

      {/* テーブル */}
      <Paper 
        sx={{ 
          ...surfaceStyles.elevated(1)(theme),
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {employees.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: spacingTokens.sm }}>
              まだ社員が登録されていません
            </Typography>
            <Typography variant="body2" sx={{ mb: spacingTokens.lg }}>
              「社員登録」ボタンから新しい社員を登録してください
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddEmployee}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                alignSelf: 'center',
              }}
            >
              社員登録
            </Button>
          </Box>
        ) : filteredAndSortedEmployees.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: spacingTokens.sm }}>
              検索条件に一致する社員が見つかりません
            </Typography>
            <Typography variant="body2">
              検索条件やフィルターを変更してみてください
            </Typography>
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
                        onClick={() => handleSort('name')}
                      >
                        社員
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.field === 'department'}
                        direction={sortConfig.field === 'department' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('department')}
                      >
                        部署
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.field === 'position'}
                        direction={sortConfig.field === 'position' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('position')}
                      >
                        役職
                      </TableSortLabel>
                    </TableCell>
                    {!isMobile && <TableCell>スキル</TableCell>}
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.field === 'joinDate'}
                        direction={sortConfig.field === 'joinDate' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('joinDate')}
                      >
                        入社日
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.field === 'isActive'}
                        direction={sortConfig.field === 'isActive' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('isActive')}
                      >
                        ステータス
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEmployees.map((employee) => (
                    <TableRow 
                      key={employee.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        opacity: employee.isActive ? 1 : 0.6
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36,
                              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
                            }}
                          >
                            {getInitials(employee.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                              {employee.name}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' }
                              }}
                              onClick={() => handleCopyEmail(employee.email, employee.name)}
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
                              <Chip 
                                key={skill}
                                label={skill} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                            {employee.skills.length > 2 && (
                              <Chip 
                                label={`+${employee.skills.length - 2}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      )}
                      <TableCell>{formatDate(employee.joinDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={employee.isActive ? '在籍' : '退職'}
                          color={employee.isActive ? 'success' : 'default'}
                          size="small"
                          icon={employee.isActive ? <PersonIcon /> : <PersonOffIcon />}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="詳細表示">
                            <IconButton
                              size="small"
                              onClick={() => handleViewEmployee(employee)}
                              sx={{ color: 'primary.main' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="編集">
                            <IconButton
                              size="small"
                              onClick={() => handleEditEmployee(employee)}
                              sx={{ color: 'info.main' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={employee.isActive ? '退職にする' : '復職にする'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleStatus(employee)}
                              sx={{ color: employee.isActive ? 'warning.main' : 'success.main' }}
                            >
                              {employee.isActive ? <PersonOffIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="削除">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteEmployee(employee)}
                              sx={{ color: 'error.main' }}
                            >
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

            {/* ページネーション */}
            <TablePagination
              component="div"
              count={filteredAndSortedEmployees.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="表示件数:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} / ${count}件`
              }
              sx={{ 
                borderTop: 1,
                borderColor: 'divider',
                '& .MuiTablePagination-toolbar': {
                  minHeight: 48,
                }
              }}
            />
          </>
        )}
      </Paper>

      {/* 社員登録・編集モーダル */}
      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={employeeToEdit}
      />

      {/* 社員詳細モーダル */}
      {selectedEmployee && (
        <EmployeeModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          employee={selectedEmployee}
        />
      )}
    </Box>
  );
};
