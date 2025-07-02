import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface SearchFieldProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  width?: number | string;
}

/**
 * 検索フィールドコンポーネント
 * MUI v7に準拠した実装
 */
export const SearchField: React.FC<SearchFieldProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = '検索...',
  width = 300,
}) => {
  const theme = useTheme();

  return (
    <TextField
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      size="small"
      sx={{ 
        minWidth: { xs: '100%', sm: width },
        '& .MuiInputBase-input': {
          color: theme.palette.text.primary,
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.7,
          },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <IconButton 
                edge="end" 
                onClick={() => onSearchChange('')} 
                size="small"
                aria-label="クリア"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }
      }}
    />
  );
};

export default SearchField;
