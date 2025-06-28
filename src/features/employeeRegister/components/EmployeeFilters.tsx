import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { surfaceStyles } from '../../../theme/componentStyles';
import { spacingTokens } from '../../../theme/designSystem';

interface EmployeeFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  departments: string[];
  departmentFilter: string;
  statusFilter: string;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  filtersExpanded: boolean;
  onToggleExpanded: () => void;
  onClearFilters: () => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchQuery,
  onSearchChange,
  departments,
  departmentFilter,
  statusFilter,
  onDepartmentChange,
  onStatusChange,
  filtersExpanded,
  onToggleExpanded,
  onClearFilters,
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ ...surfaceStyles.elevated(1)(theme), p: spacingTokens.md, mb: spacingTokens.md }}>
      <Stack spacing={spacingTokens.md}>
        <TextField
          fullWidth
          placeholder="社員名、部署、役職、メール、スキルで検索..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment:
              searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
          }}
          size="small"
          sx={{ maxWidth: 500 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
          <Button
            variant="text"
            startIcon={filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={onToggleExpanded}
            size="small"
          >
            詳細フィルター
          </Button>
          {(departmentFilter || statusFilter) && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
              size="small"
              color="warning"
            >
              フィルタークリア
            </Button>
          )}
        </Box>
        <Collapse in={filtersExpanded}>
          <Box
            sx={{
              display: 'flex',
              gap: spacingTokens.md,
              flexDirection: { xs: 'column', sm: 'row' },
              maxWidth: 600,
            }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>部署</InputLabel>
              <Select
                value={departmentFilter}
                onChange={(e) => onDepartmentChange(e.target.value)}
                label="部署"
              >
                <MenuItem value="">すべて</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
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
    </Box>
  );
};

export default EmployeeFilters;
