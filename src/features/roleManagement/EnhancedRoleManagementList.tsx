/**
 * 権限管理リスト（検索・フィルタ・ソート機能付き）
 */
import React, { useState } from 'react';
import { Card, CardContent, Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { spacingTokens } from '../../theme/designSystem';
import { UserRole } from '../../auth/types/roles';
import { useRoleManagementStore } from './stores/useRoleManagementStore';
import { RoleManagementListTable } from './components/RoleManagementListTable';

// 部門データ（実際の実装では別のAPIから取得）
const DEPARTMENTS = [
  { id: 'dev', name: '開発部' },
  { id: 'sales', name: '営業部' },
  { id: 'hr', name: '人事部' },
  { id: 'finance', name: '経理部' },
  { id: 'management', name: '経営企画部' }
];

export const EnhancedRoleManagementList: React.FC = () => {
  // 状態管理はStoreに移動するのが理想的ですが、簡略化のため一部はコンポーネント内に保持
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string | 'all'>('all');
  
  const { loading, error, loadUsers } = useRoleManagementStore();
  
  // 初期データ読み込み
  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  // 検索処理
  const handleSearch = () => {
    loadUsers(1, { searchQuery, roleFilter, departmentFilter });
  };

  return (
    <>
      {/* フィルターエリア */}
      <Card sx={{ mb: spacingTokens.lg }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'flex-end' }}>
            <Box>
              <TextField
                label="ユーザー検索"
                fullWidth
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="名前、メールアドレス"
                slotProps={{
                  input: {
                    endAdornment: (
                      <Button
                        size="small"
                        onClick={handleSearch}
                        sx={{ minWidth: 'unset', p: 0.5 }}
                      >
                        <SearchIcon />
                      </Button>
                    )
                  }
                }}
              />
            </Box>
            
            <Box>
              <FormControl fullWidth>
                <InputLabel>ロール</InputLabel>
                <Select
                  value={roleFilter}
                  label="ロール"
                  onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
                >
                  <MenuItem value="all">すべて</MenuItem>
                  {Object.values(UserRole).map(role => (
                    <MenuItem key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <FormControl fullWidth>
                <InputLabel>部門</InputLabel>
                <Select
                  value={departmentFilter}
                  label="部門"
                  onChange={e => setDepartmentFilter(e.target.value as string)}
                >
                  <MenuItem value="all">すべて</MenuItem>
                  {DEPARTMENTS.map(dept => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <Button
                variant="contained"
                startIcon={<FilterIcon />}
                onClick={handleSearch}
                fullWidth
              >
                フィルター適用
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* エラー表示 */}
      {error && (
        <Alert severity="error" sx={{ mb: spacingTokens.md }}>
          {error}
        </Alert>
      )}
      
      {/* ユーザーテーブル */}
      <RoleManagementListTable />
    </>
  );
};

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
