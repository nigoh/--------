/**
 * 検索フィールドコンポーネント
 */
import React, { useState, useCallback } from 'react';
import { TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  label?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = '検索...',
  label = '検索',
}) => {
  // 内部状態
  const [focused, setFocused] = useState(false);

  // Enterキー押下時の処理
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSearch();
      }
    },
    [onSearch]
  );

  // クリアボタン押下時の処理
  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <Tooltip title="クリア">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  edge="end"
                  aria-label="検索をクリア"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          transition: 'all 0.2s',
          ...(focused && {
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
          }),
        },
      }}
    />
  );
};
