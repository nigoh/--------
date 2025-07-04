/**
 * ユーザー一覧テーブルコンポーネント
 */
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Switch,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonOutline as PersonOutlineIcon,
} from '@mui/icons-material';
import { User, SortConfig, PaginationConfig } from '../types';
import { UserRole, useAuth, Permission } from '@/auth';
import { PermissionGate } from '@/components/common';
import { useUserManagementStore } from '../stores/useUserManagementStore';
import {
  DEPARTMENT_LABELS,
  POSITION_LABELS,
  ROLE_LABELS,
  PAGE_SIZE_OPTIONS,
} from '../constants/userConstants';

interface UserListTableProps {
  users: User[];
  loading: boolean;
  sortConfig: SortConfig;
  pagination: PaginationConfig;
  onSortChange: (sortConfig: SortConfig) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const UserListTable: React.FC<UserListTableProps> = ({
  users,
  loading,
  sortConfig,
  pagination,
  onSortChange,
  onPageChange,
  onPageSizeChange,
}) => {
  const { user: currentUser } = useAuth();
  const {
    openEditDialog,
    openDeleteDialog,
    toggleUserStatus,
    saving,
  } = useUserManagementStore();

  const handleSort = (field: keyof User) => {
    const isCurrentField = sortConfig.field === field;
    const direction = isCurrentField && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field, direction });
  };

  const handleStatusToggle = async (user: User, event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    await toggleUserStatus(user.uid);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ja-JP');
  };

  const formatLastLogin = (lastLogin?: Date) => {
    if (!lastLogin) return '未ログイン';
    
    const now = new Date();
    const diff = now.getTime() - lastLogin.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '今日';
    if (days === 1) return '昨日';
    if (days < 7) return `${days}日前`;
    if (days < 30) return `${Math.floor(days / 7)}週間前`;
    if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
    return `${Math.floor(days / 365)}年前`;
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Avatar sx={{ width: 32, height: 32 }}>
                  <PersonOutlineIcon fontSize="small" />
                </Avatar>
              </TableCell>
              
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'employeeId'}
                  direction={sortConfig.field === 'employeeId' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('employeeId')}
                >
                  社員番号
                </TableSortLabel>
              </TableCell>
              
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'name'}
                  direction={sortConfig.field === 'name' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  氏名
                </TableSortLabel>
              </TableCell>
              
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'email'}
                  direction={sortConfig.field === 'email' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  メールアドレス
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
              
              <TableCell>ロール</TableCell>
              
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'lastLogin'}
                  direction={sortConfig.field === 'lastLogin' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('lastLogin')}
                >
                  最終ログイン
                </TableSortLabel>
              </TableCell>
              
              <TableCell>ステータス</TableCell>
              
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    ユーザーが見つかりません
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid} hover>
                  {/* アバター */}
                  <TableCell>
                    <Avatar
                      src={user.photoURL || undefined}
                      sx={{ width: 32, height: 32 }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </TableCell>
                  
                  {/* 社員番号 */}
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {user.employeeId}
                    </Typography>
                  </TableCell>
                  
                  {/* 氏名 */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name}
                      </Typography>
                      {user.nameKana && (
                        <Typography variant="caption" color="text.secondary">
                          {user.nameKana}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  {/* メールアドレス */}
                  <TableCell>
                    <Typography variant="body2">
                      {user.email}
                    </Typography>
                  </TableCell>
                  
                  {/* 部署 */}
                  <TableCell>
                    <Typography variant="body2">
                      {DEPARTMENT_LABELS[user.department as keyof typeof DEPARTMENT_LABELS] || user.department}
                    </Typography>
                  </TableCell>
                  
                  {/* 役職 */}
                  <TableCell>
                    <Typography variant="body2">
                      {POSITION_LABELS[user.position as keyof typeof POSITION_LABELS] || user.position}
                    </Typography>
                  </TableCell>
                  
                  {/* ロール */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {user.roles.map((role) => (
                        <Chip
                          key={role}
                          label={ROLE_LABELS[role]}
                          size="small"
                          color={
                            role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
                              ? 'error'
                              : role === UserRole.MANAGER
                              ? 'warning'
                              : 'default'
                          }
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  
                  {/* 最終ログイン */}
                  <TableCell>
                    <Typography variant="body2">
                      {formatLastLogin(user.lastLogin)}
                    </Typography>
                  </TableCell>
                  
                  {/* ステータス */}
                  <TableCell>
                    <PermissionGate requiredPermission={Permission.USER_MANAGEMENT}>
                      <Switch
                        checked={user.isActive}
                        onChange={(e) => handleStatusToggle(user, e)}
                        disabled={saving || user.uid === currentUser?.uid}
                        size="small"
                      />
                    </PermissionGate>
                    {!currentUser || user.uid !== currentUser.uid ? null : (
                      <Chip
                        label={user.isActive ? 'アクティブ' : '非アクティブ'}
                        size="small"
                        color={user.isActive ? 'success' : 'default'}
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  
                  {/* 操作 */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <PermissionGate requiredPermission={Permission.USER_MANAGEMENT}>
                        <Tooltip title="編集">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(user)}
                            disabled={saving}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {user.uid !== currentUser?.uid && (
                          <Tooltip title="削除">
                            <IconButton
                              size="small"
                              onClick={() => openDeleteDialog(user)}
                              disabled={saving}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </PermissionGate>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* ページネーション */}
      <TablePagination
        component="div"
        count={pagination.totalUsers}
        page={pagination.page - 1} // MUIは0ベース
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pagination.pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value))}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        labelRowsPerPage="表示件数:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / ${count !== -1 ? count : `${to}以上`}`
        }
      />
    </Box>
  );
};
