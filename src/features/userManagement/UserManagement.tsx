/**
 * ユーザー管理メインページ
 */
import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { PermissionGate, useAuth, UserRole, Permission } from '../../auth';
import { useUserManagementStore } from './stores/useUserManagementStore';
import { 
  UserListTable, 
  UserStatsCards, 
  UserFilters as UserFiltersComponent, 
  UserFormDialog, 
  UserDeleteDialog 
} from './components';
import { ROLE_LABELS } from './constants/userConstants';

const UserManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    users,
    stats,
    loading,
    error,
    filters,
    sortConfig,
    pagination,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    loadUsers,
    loadStats,
    setFilters,
    setSortConfig,
    setPage,
    setPageSize,
    openAddDialog,
    clearError,
    generateDummyData,
  } = useUserManagementStore();

  // 初期化
  useEffect(() => {
    if (isAuthenticated) {
      loadUsers(true);
      loadStats();
    }
  }, [isAuthenticated, loadUsers, loadStats]);

  // エラークリア
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleRefresh = () => {
    loadUsers(true);
    loadStats();
  };

  const handleExport = () => {
    // TODO: CSVエクスポート機能
    console.log('CSVエクスポート機能を実装予定');
  };

  const handleImport = () => {
    // TODO: CSVインポート機能
    console.log('CSVインポート機能を実装予定');
  };

  const handleGenerateDummyData = () => {
    generateDummyData();
  };

  // 認証されていない場合
  if (!isAuthenticated) {
    return (
      <FeatureLayout maxWidth={false}>
        <FeatureContent variant="paper" padding={2}>
          <Typography variant="h6" color="error">
            ログインが必要です
          </Typography>
        </FeatureContent>
      </FeatureLayout>
    );
  }

  // ヘッダーアクション
  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
      {/* 統計情報表示 */}
      {stats && (
        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
          <Chip
            label={`総計: ${stats.total}`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip
            label={`アクティブ: ${stats.active}`}
            color="success"
            variant="outlined"
            size="small"
          />
        </Box>
      )}
      
      {/* 操作ボタン */}
      <Tooltip title="更新">
        <IconButton onClick={handleRefresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      
      <PermissionGate requiredPermission={Permission.USER_MANAGEMENT}>
        <Tooltip title="CSVエクスポート">
          <IconButton onClick={handleExport}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="CSVインポート">
          <IconButton onClick={handleImport}>
            <UploadIcon />
          </IconButton>
        </Tooltip>
      </PermissionGate>
      
      {/* 開発環境限定 */}
      {process.env.NODE_ENV === 'development' && (
        <Button
          variant="outlined"
          onClick={handleGenerateDummyData}
          disabled={loading}
          size="small"
        >
          ダミーデータ生成
        </Button>
      )}
      
      <PermissionGate requiredPermission={Permission.USER_MANAGEMENT}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={openAddDialog}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          ユーザー追加
        </Button>
      </PermissionGate>
    </Box>
  );

  return (
    <PermissionGate
      requiredPermission={Permission.EMPLOYEE_VIEW}
      fallback={
        <FeatureLayout maxWidth={false}>
          <FeatureContent variant="paper" padding={2}>
            <Typography variant="h6" color="error">
              この機能にアクセスする権限がありません
            </Typography>
          </FeatureContent>
        </FeatureLayout>
      }
    >
      <FeatureLayout maxWidth={false}>
        <FeatureHeader
          title="ユーザー管理"
          subtitle="社員情報と権限を統合管理します"
          icon={<PersonAddIcon fontSize="large" />}
          actions={headerActions}
          showAddButton={false}
        />

        <FeatureContent variant="transparent" padding={2}>
          {/* エラー表示 */}
          {error && (
            <Card sx={{ mb: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
              <CardContent>
                <Typography variant="body2">{error}</Typography>
              </CardContent>
            </Card>
          )}

          {/* 統計カード */}
          {stats && (
            <Box sx={{ mb: 3 }}>
              <UserStatsCards stats={stats} />
            </Box>
          )}

          {/* フィルター */}
          <Box sx={{ mb: 2 }}>
            <UserFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              loading={loading}
            />
          </Box>

          {/* ユーザー一覧テーブル */}
          <Card>
            <UserListTable
              users={users}
              loading={loading}
              sortConfig={sortConfig}
              pagination={pagination}
              onSortChange={setSortConfig}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </Card>

          {/* ダイアログ */}
          <UserFormDialog />
          <UserDeleteDialog />
        </FeatureContent>
      </FeatureLayout>
    </PermissionGate>
  );
};

export { UserManagement };

export default UserManagement;
