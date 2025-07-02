/**
 * 権限管理フィルター表示
 */
import React from 'react';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { UserRole } from '../../../auth/types/roles';
import { spacingTokens } from '../../../theme/designSystem';

// 部門データ（実際の実装では別のAPIから取得）
const DEPARTMENTS = [
  { id: 'dev', name: '開発部' },
  { id: 'sales', name: '営業部' },
  { id: 'hr', name: '人事部' },
  { id: 'finance', name: '経理部' },
  { id: 'management', name: '経営企画部' }
];

interface RoleManagementFiltersProps {
  searchQuery: string;
  roleFilter: UserRole | 'all';
  departmentFilter: string | 'all';
  onClearSearch: () => void;
  onClearRoleFilter: () => void;
  onClearDepartmentFilter: () => void;
}

export const RoleManagementFilters: React.FC<RoleManagementFiltersProps> = ({
  searchQuery,
  roleFilter,
  departmentFilter,
  onClearSearch,
  onClearRoleFilter,
  onClearDepartmentFilter,
}) => {
  // アクティブなフィルターの数を確認
  const hasActiveFilters = 
    searchQuery !== '' || 
    roleFilter !== 'all' || 
    departmentFilter !== 'all';

  if (!hasActiveFilters) return null;

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
  function getDepartmentName(departmentId: string): string {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department ? department.name : departmentId;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: spacingTokens.md }}>
      {/* 検索フィルター */}
      {searchQuery && (
        <Chip
          label={`検索: ${searchQuery}`}
          onDelete={onClearSearch}
          size="small"
        />
      )}
      
      {/* ロールフィルター */}
      {roleFilter !== 'all' && (
        <Chip
          label={`ロール: ${getRoleDisplayName(roleFilter)}`}
          onDelete={onClearRoleFilter}
          size="small"
          color="primary"
        />
      )}
      
      {/* 部門フィルター */}
      {departmentFilter !== 'all' && (
        <Chip
          label={`部門: ${getDepartmentName(departmentFilter)}`}
          onDelete={onClearDepartmentFilter}
          size="small"
          color="info"
        />
      )}
      
      {/* 全てクリア */}
      {hasActiveFilters && (
        <Tooltip title="フィルターをクリア">
          <IconButton 
            size="small" 
            onClick={() => {
              onClearSearch();
              onClearRoleFilter();
              onClearDepartmentFilter();
            }}
            sx={{ ml: 1 }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
