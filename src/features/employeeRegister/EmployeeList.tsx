/**
 * 社員一覧表示コンポーネント
 * 
 * 登録済みの社員リストを表示し、編集・削除・ステータス変更機能を提供
 */
import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip,
  Avatar,
  TablePagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  PersonOff as PersonOffIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useEmployeeStore } from './useEmployeeStore';
import { Employee } from './useEmployeeStore';
import { useTemporary } from '../../hooks/useTemporary';

/**
 * 社員一覧コンポーネント
 */
export const EmployeeList: React.FC = () => {
  const { employees, deleteEmployee, toggleEmployeeStatus } = useEmployeeStore();
  const { toast, progress, clipboard } = useTemporary();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 検索フィルタリング
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ページネーション用データ
  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
    if (employeeToDelete) {
      progress.start('社員情報を削除中...', 1);
      
      try {
        // 擬似的な遅延
        await new Promise(resolve => setTimeout(resolve, 800));
        
        deleteEmployee(employeeToDelete.id);
        progress.complete();
        
        toast.success(`${employeeToDelete.name}さんの情報を削除しました`);
        
        setDeleteConfirmOpen(false);
        setEmployeeToDelete(null);
        
        // 1秒後に進行状況をクリア
        setTimeout(() => {
          progress.clear();
        }, 1000);
        
      } catch (err) {
        progress.error();
        toast.error('削除に失敗しました');
        
        setTimeout(() => {
          progress.clear();
        }, 2000);
      }
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
   * ステータス切り替え
   */
  const handleToggleStatus = (employee: Employee) => {
    toggleEmployeeStatus(employee.id);
    const newStatus = employee.isActive ? '無効' : '有効';
    toast.info(`${employee.name}さんのステータスを${newStatus}に変更しました`);
  };

  /**
   * メールアドレスをクリップボードにコピー
   */
  const handleCopyEmail = (email: string, employeeName: string) => {
    clipboard.copy(email);
    toast.success(`${employeeName}さんのメールアドレスをコピーしました`);
  };

  /**
   * ページ変更
   */
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * 表示件数変更
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 1.5,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}
        >
          社員一覧
        </Typography>

        {/* 検索フィールド */}
        <TextField
          fullWidth
          placeholder="社員名、部署、役職、メールアドレスで検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ 
            maxWidth: 400,
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }
          }}
        />
      </Box>

      {employees.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            color: 'text.secondary' 
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
            まだ社員が登録されていません
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            「社員登録」タブから新しい社員を登録してください
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer 
            component={Paper} 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 1 
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                  <TableCell>社員</TableCell>
                  <TableCell>部署</TableCell>
                  <TableCell>役職</TableCell>
                  <TableCell>スキル</TableCell>
                  <TableCell>入社日</TableCell>
                  <TableCell>ステータス</TableCell>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                          }}
                        >
                          {getInitials(employee.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
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
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                        {employee.skills.slice(0, 3).map((skill) => (
                          <Chip 
                            key={skill}
                            label={skill} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {employee.skills.length > 3 && (
                          <Chip 
                            label={`+${employee.skills.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </TableCell>
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
                            onClick={() => handleDeleteClick(employee)}
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
            count={filteredEmployees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="表示件数:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} / ${count}件`
            }
            sx={{ 
              mt: 1.5,
              '& .MuiTablePagination-toolbar': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
              }
            }}
          />
        </>
      )}

      {/* 社員詳細ダイアログ */}
      <Dialog
        open={!!selectedEmployee}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        {selectedEmployee && (
          <>
            <DialogTitle sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {selectedEmployee.name} の詳細情報
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>基本情報</Typography>
                  <Stack spacing={1}>
                    <Typography><strong>氏名:</strong> {selectedEmployee.name}</Typography>
                    <Typography><strong>メール:</strong> {selectedEmployee.email}</Typography>
                    <Typography><strong>電話:</strong> {selectedEmployee.phone || '未登録'}</Typography>
                    <Typography><strong>入社日:</strong> {formatDate(selectedEmployee.joinDate)}</Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>部署・役職</Typography>
                  <Stack spacing={1}>
                    <Typography><strong>部署:</strong> {selectedEmployee.department}</Typography>
                    <Typography><strong>役職:</strong> {selectedEmployee.position}</Typography>
                    <Typography><strong>ステータス:</strong> 
                      <Chip 
                        label={selectedEmployee.isActive ? '在籍' : '退職'}
                        color={selectedEmployee.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>スキル</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedEmployee.skills.length > 0 ? (
                      selectedEmployee.skills.map((skill) => (
                        <Chip key={skill} label={skill} variant="outlined" />
                      ))
                    ) : (
                      <Typography color="text.secondary">スキル情報なし</Typography>
                    )}
                  </Box>
                </Box>

                {selectedEmployee.notes && (
                  <Box>
                    <Typography variant="h6" gutterBottom>備考</Typography>
                    <Typography sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedEmployee.notes}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="h6" gutterBottom>その他情報</Typography>
                  <Stack spacing={1}>
                    <Typography><strong>登録日:</strong> {formatDate(selectedEmployee.createdAt)}</Typography>
                    <Typography><strong>更新日:</strong> {formatDate(selectedEmployee.updatedAt)}</Typography>
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDetail} variant="outlined">
                閉じる
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          社員削除の確認
        </DialogTitle>
        <DialogContent>
          <Typography>
            本当に「{employeeToDelete?.name}」を削除しますか？
          </Typography>
          <Typography color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
            この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">
            キャンセル
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
