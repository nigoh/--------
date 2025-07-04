/**
 * ユーザーフィルターコンポーネント
 */
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Grid,
  Stack,
  Paper,
  Typography,
  Autocomplete,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { UserFilters as UserFiltersType } from '../types';
import { UserRole } from '@/auth';
import {
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  POSITIONS,
  POSITION_LABELS,
  SKILLS,
  ROLE_LABELS,
  STATUS_OPTIONS,
} from '../constants/userConstants';

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: Partial<UserFiltersType>) => void;
  loading?: boolean;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const handleClearFilters = () => {
    const clearedFilters: UserFiltersType = {
      searchQuery: '',
      roleFilter: 'all' as const,
      departmentFilter: 'all' as const,
      positionFilter: 'all' as const,
      skillFilter: 'all' as const,
      statusFilter: 'all' as const,
      lastLoginDays: undefined,
    };
    console.log('Clearing filters:', clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.searchQuery ||
    (filters.roleFilter && filters.roleFilter !== 'all') ||
    (filters.departmentFilter && filters.departmentFilter !== 'all') ||
    (filters.positionFilter && filters.positionFilter !== 'all') ||
    (filters.skillFilter && filters.skillFilter !== 'all') ||
    (filters.statusFilter && filters.statusFilter !== 'all') ||
    filters.lastLoginDays;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        フィルター
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        {/* 検索クエリ */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="検索"
            placeholder="名前、メール、社員番号..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            disabled={loading}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>

        {/* ロールフィルター */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>ロール</InputLabel>
            <Select
              value={filters.roleFilter || 'all'}
              onChange={(e) => onFiltersChange({ roleFilter: e.target.value as any })}
              disabled={loading}
            >
              <MenuItem value="all">全て</MenuItem>
              {Object.values(UserRole).map((role) => (
                <MenuItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 部署フィルター */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>部署</InputLabel>
            <Select
              value={filters.departmentFilter || 'all'}
              onChange={(e) => onFiltersChange({ departmentFilter: e.target.value })}
              disabled={loading}
            >
              <MenuItem value="all">全て</MenuItem>
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {DEPARTMENT_LABELS[dept]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 役職フィルター */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>役職</InputLabel>
            <Select
              value={filters.positionFilter || 'all'}
              onChange={(e) => onFiltersChange({ positionFilter: e.target.value })}
              disabled={loading}
            >
              <MenuItem value="all">全て</MenuItem>
              {POSITIONS.map((position) => (
                <MenuItem key={position} value={position}>
                  {POSITION_LABELS[position]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ステータスフィルター */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={filters.statusFilter || 'all'}
              onChange={(e) => onFiltersChange({ statusFilter: e.target.value as any })}
              disabled={loading}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* クリアボタン */}
        <Grid item xs={12} md={1}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClearFilters}
            disabled={loading || !hasActiveFilters}
            startIcon={<ClearIcon />}
          >
            クリア
          </Button>
        </Grid>
      </Grid>

      {/* 第二行: スキルフィルターと追加オプション */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* スキルフィルター */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={SKILLS}
            value={filters.skillFilter === 'all' ? null : filters.skillFilter || null}
            onChange={(_, value) => onFiltersChange({ skillFilter: value || 'all' })}
            disabled={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="スキル"
                placeholder="スキルを選択..."
              />
            )}
          />
        </Grid>

        {/* 最終ログイン日数フィルター */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>最終ログイン</InputLabel>
            <Select
              value={filters.lastLoginDays || ''}
              onChange={(e) => onFiltersChange({ 
                lastLoginDays: e.target.value ? Number(e.target.value) : undefined 
              })}
              disabled={loading}
            >
              <MenuItem value="">全て</MenuItem>
              <MenuItem value={7}>7日以内</MenuItem>
              <MenuItem value={30}>30日以内</MenuItem>
              <MenuItem value={90}>90日以内</MenuItem>
              <MenuItem value={365}>1年以内</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* アクティブフィルター表示 */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.searchQuery && (
            <Chip
              label={`検索: ${filters.searchQuery}`}
              onDelete={() => onFiltersChange({ searchQuery: '' })}
              size="small"
            />
          )}
          {filters.roleFilter && filters.roleFilter !== 'all' && (
            <Chip
              label={`ロール: ${ROLE_LABELS[filters.roleFilter]}`}
              onDelete={() => onFiltersChange({ roleFilter: 'all' })}
              size="small"
            />
          )}
          {filters.departmentFilter && filters.departmentFilter !== 'all' && (
            <Chip
              label={`部署: ${DEPARTMENT_LABELS[filters.departmentFilter as keyof typeof DEPARTMENT_LABELS]}`}
              onDelete={() => onFiltersChange({ departmentFilter: 'all' })}
              size="small"
            />
          )}
          {filters.positionFilter && filters.positionFilter !== 'all' && (
            <Chip
              label={`役職: ${POSITION_LABELS[filters.positionFilter as keyof typeof POSITION_LABELS]}`}
              onDelete={() => onFiltersChange({ positionFilter: 'all' })}
              size="small"
            />
          )}
          {filters.statusFilter && filters.statusFilter !== 'all' && (
            <Chip
              label={`ステータス: ${STATUS_OPTIONS.find(opt => opt.value === filters.statusFilter)?.label}`}
              onDelete={() => onFiltersChange({ statusFilter: 'all' })}
              size="small"
            />
          )}
          {filters.skillFilter && filters.skillFilter !== 'all' && (
            <Chip
              label={`スキル: ${filters.skillFilter}`}
              onDelete={() => onFiltersChange({ skillFilter: 'all' })}
              size="small"
            />
          )}
          {filters.lastLoginDays && (
            <Chip
              label={`最終ログイン: ${filters.lastLoginDays}日以内`}
              onDelete={() => onFiltersChange({ lastLoginDays: undefined })}
              size="small"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};
