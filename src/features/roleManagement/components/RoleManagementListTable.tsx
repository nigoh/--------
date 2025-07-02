/**
 * 権限管理リストテーブル
 */
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Pagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  SecurityOutlined as SecurityIcon,
} from '@mui/icons-material';
import { spacingTokens } from '../../../theme/designSystem';
import { UserRole } from '../../../auth/types/roles';
import { useRoleManagementForm } from '../hooks/useRoleManagementForm';
import { useRoleManagementStore } from '../stores/useRoleManagementStore';

// 部門データ（実際の実装では別のAPIから取得、後でconstantsに移動）
const DEPARTMENTS = [
  { id: 'dev', name: '開発部' },
  { id: 'sales', name: '営業部' },
  { id: 'hr', name: '人事部' },
  { id: 'finance', name: '経理部' },
  { id: 'management', name: '経営企画部' }
];

export const RoleManagementListTable: React.FC = () => {
  const { users, loading, page, totalPages, setPage } = useRoleManagementStore();
  const { 
    editingUserId,
    startEditing,
    cancelEditing,
    saveEditing,
    openPermissionDialog,
    editData
  } = useRoleManagementForm();

  return (
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ユーザー</TableCell>
                <TableCell>メールアドレス</TableCell>
                <TableCell>ロール</TableCell>
                <TableCell>部門</TableCell>
                <TableCell>役職</TableCell>
                <TableCell>権限</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: spacingTokens.lg }}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: spacingTokens.sm }}>
                      データ読み込み中...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: spacingTokens.lg }}>
                    <Typography variant="body1" color="text.secondary">
                      ユーザーが見つかりません
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.uid}>
                    {/* ユーザー情報 */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                        {user.photoURL ? (
                          <Box
                            component="img"
                            src={user.photoURL}
                            sx={{ width: 32, height: 32, borderRadius: '50%' }}
                            alt={user.displayName || 'ユーザー'}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'primary.light',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.875rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {(user.displayName || user.email[0]).substring(0, 1).toUpperCase()}
                          </Box>
                        )}
                        <Typography>{user.displayName || '未設定'}</Typography>
                      </Box>
                    </TableCell>
                    
                    {/* メールアドレス */}
                    <TableCell>{user.email}</TableCell>
                    
                    {/* ロール */}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {user.roles.map(role => (
                          <Chip
                            key={role}
                            label={getRoleDisplayName(role)}
                            size="small"
                            color={getRoleColor(role)}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    
                    {/* 部門 */}
                    <TableCell>
                      {getDepartmentName(user.department)}
                    </TableCell>
                    
                    {/* 役職 */}
                    <TableCell>
                      {user.position || '未設定'}
                    </TableCell>
                    
                    {/* 権限 */}
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<SecurityIcon />}
                        onClick={() => openPermissionDialog(user.uid)}
                      >
                        権限設定
                        {user.permissions.length > 0 && (
                          <Chip
                            label={user.permissions.length}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Button>
                    </TableCell>
                    
                    {/* 操作 */}
                    <TableCell>
                      {editingUserId === user.uid ? (
                        <Box sx={{ display: 'flex', gap: spacingTokens.sm }}>
                          <IconButton color="primary" onClick={saveEditing} disabled={loading}>
                            <SaveIcon />
                          </IconButton>
                          <IconButton color="error" onClick={cancelEditing} disabled={loading}>
                            <CancelIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <IconButton color="primary" onClick={() => startEditing(user.uid)} disabled={loading}>
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* ページネーション */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: spacingTokens.md }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            disabled={loading}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// ユーティリティ関数
// ロールの表示名を取得
function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: '管理者',
    [UserRole.MANAGER]: '管理職',
    [UserRole.EMPLOYEE]: '社員',
    [UserRole.GUEST]: 'ゲスト'
  };
  
  return displayNames[role] || role;
}

// 部門名を取得
function getDepartmentName(departmentId?: string): string {
  if (!departmentId) return '未設定';
  const department = DEPARTMENTS.find(d => d.id === departmentId);
  return department ? department.name : '未設定';
}

// ロールの色を取得
function getRoleColor(role: UserRole): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (role) {
    case UserRole.ADMIN:
      return 'error';
    case UserRole.MANAGER:
      return 'primary';
    case UserRole.EMPLOYEE:
      return 'success';
    case UserRole.GUEST:
      return 'default';
    default:
      return 'default';
  }
}
