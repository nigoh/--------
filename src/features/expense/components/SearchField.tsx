import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ value, onChange }) => (
  <TextField
    fullWidth
    placeholder="カテゴリ、金額、備考で検索..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }
    }}
    size="small"
    sx={{
      maxWidth: 400,
      mb: 1.5,
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
    }}
  />
);

export default SearchField;
