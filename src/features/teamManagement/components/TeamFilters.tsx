import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useTeamStore } from '../stores/useTeamStore';
import { TEAM_STATUS, TEAM_TYPES } from '../constants/teamConstants';
import type { TeamStatus, TeamType } from '../constants/teamConstants';

/**
 * チーム一覧のフィルター表示コンポーネント
 */
export const TeamFilters: React.FC = () => {
  const {
    statusFilter,
    typeFilter,
    searchQuery,
    setStatusFilter,
    setTypeFilter,
    setSearchQuery,
    clearFilters,
  } = useTeamStore();

  const hasActiveFilters = statusFilter || typeFilter || searchQuery;

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as TeamStatus | '');
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value as TeamType | '');
  };

  const handleClearStatusFilter = () => {
    setStatusFilter('');
  };

  const handleClearTypeFilter = () => {
    setTypeFilter('');
  };

  const handleClearSearchQuery = () => {
    setSearchQuery('');
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* フィルター選択 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>ステータス</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            label="ステータス"
          >
            <MenuItem value="">
              <em>すべて</em>
            </MenuItem>
            {TEAM_STATUS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>タイプ</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            label="タイプ"
          >
            <MenuItem value="">
              <em>すべて</em>
            </MenuItem>
            {TEAM_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <IconButton
            onClick={clearFilters}
            size="small"
            color="primary"
            title="すべてのフィルターをクリア"
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {/* アクティブフィルター表示 */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            フィルター:
          </Typography>

          {searchQuery && (
            <Chip
              size="small"
              label={`検索: "${searchQuery}"`}
              onDelete={handleClearSearchQuery}
              color="primary"
              variant="outlined"
            />
          )}

          {statusFilter && (
            <Chip
              size="small"
              label={`ステータス: ${statusFilter}`}
              onDelete={handleClearStatusFilter}
              color="primary"
              variant="outlined"
            />
          )}

          {typeFilter && (
            <Chip
              size="small"
              label={`タイプ: ${typeFilter}`}
              onDelete={handleClearTypeFilter}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
};
