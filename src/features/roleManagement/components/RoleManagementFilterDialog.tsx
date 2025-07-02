/**
 * 権限管理フィルターダイアログ
 */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Box,
  Typography,
} from '@mui/material';
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

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters: FilterValues;
}

export interface FilterValues {
  searchQuery: string;
  roles: UserRole[];
  departments: string[];
  lastLoginDays?: number;
}

export const RoleManagementFilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onApply,
  initialFilters
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  // フィルター変更ハンドラー
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleRoleToggle = (role: UserRole) => {
    setFilters(prev => {
      if (prev.roles.includes(role)) {
        return { ...prev, roles: prev.roles.filter(r => r !== role) };
      } else {
        return { ...prev, roles: [...prev.roles, role] };
      }
    });
  };

  const handleDepartmentToggle = (deptId: string) => {
    setFilters(prev => {
      if (prev.departments.includes(deptId)) {
        return { ...prev, departments: prev.departments.filter(d => d !== deptId) };
      } else {
        return { ...prev, departments: [...prev.departments, deptId] };
      }
    });
  };

  const handleLastLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setFilters({ ...filters, lastLoginDays: value });
  };

  // フィルターをリセット
  const handleReset = () => {
    setFilters({
      searchQuery: '',
      roles: [],
      departments: [],
      lastLoginDays: undefined
    });
  };

  // フィルターを適用
  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>詳細フィルター</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {/* 検索フィールド */}
          <TextField
            label="ユーザー検索"
            fullWidth
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="名前、メールアドレスで検索"
            margin="normal"
          />

          {/* ロールフィルター */}
          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">ロール</FormLabel>
            <FormGroup row>
              {Object.values(UserRole).map(role => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      checked={filters.roles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                    />
                  }
                  label={getRoleDisplayName(role)}
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* 部門フィルター */}
          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">部門</FormLabel>
            <FormGroup row>
              {DEPARTMENTS.map(dept => (
                <FormControlLabel
                  key={dept.id}
                  control={
                    <Checkbox
                      checked={filters.departments.includes(dept.id)}
                      onChange={() => handleDepartmentToggle(dept.id)}
                    />
                  }
                  label={dept.name}
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* 最終ログイン */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>最終ログイン</InputLabel>
            <Select
              value={filters.lastLoginDays?.toString() || ''}
              label="最終ログイン"
              onChange={(e) => setFilters({ ...filters, lastLoginDays: e.target.value ? parseInt(e.target.value) : undefined })}
            >
              <MenuItem value="">指定なし</MenuItem>
              <MenuItem value="7">7日以内</MenuItem>
              <MenuItem value="30">30日以内</MenuItem>
              <MenuItem value="90">90日以内</MenuItem>
              <MenuItem value="180">180日以内</MenuItem>
            </Select>
          </FormControl>

          {/* フィルター情報 */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: spacingTokens.md }}>
            複数条件を選択した場合、AND条件として適用されます
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="inherit">
          リセット
        </Button>
        <Button onClick={onClose}>
          キャンセル
        </Button>
        <Button onClick={handleApply} variant="contained">
          適用
        </Button>
      </DialogActions>
    </Dialog>
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
