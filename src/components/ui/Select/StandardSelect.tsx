import React, { forwardRef, useMemo, useState } from 'react';
import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
  ListSubheader,
  OutlinedInput,
  FilledInput,
  Input,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  TextField,
  SelectChangeEvent
} from '@mui/material';
import {
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { StandardSelectProps, SelectOption } from './types';
import { colorTokens, spacingTokens, shapeTokens } from '../../../theme/designSystem';
import { inputStyles, stateStyles } from '../../../theme/componentStyles';

const StandardSelect = forwardRef<HTMLDivElement, StandardSelectProps>(
  ({
    options = [],
    value,
    defaultValue,
    onChange,
    label,
    helperText,
    error = false,
    required = false,
    disabled = false,
    multiple = false,
    displayEmpty = false,
    placeholder,
    size = 'medium',
    variant = 'outlined',
    fullWidth = true,
    autoWidth = false,
    native = false,
    renderValue,
    loading = false,
    success = false,
    groupBy,
    searchable = false,
    noOptionsText = 'オプションがありません',
    clearable = false,
    FormControlProps,
    InputLabelProps,
    FormHelperTextProps,
    children,
    sx,
    ...selectProps
  }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Generate unique ID for accessibility
    const labelId = `select-label-${Math.random().toString(36).substr(2, 9)}`;
    const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
    const helperTextId = helperText ? `select-helper-${Math.random().toString(36).substr(2, 9)}` : undefined;

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
      if (!searchable || !searchTerm) return options;
      return options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm, searchable]);

    // Group options if groupBy is specified
    const groupedOptions = useMemo(() => {
      if (!groupBy) return [];
      
      const grouped = filteredOptions.reduce((acc, option) => {
        const group = option.group || 'その他';
        if (!acc[group]) acc[group] = [];
        acc[group].push(option);
        return acc;
      }, {} as Record<string, SelectOption[]>);

      return Object.entries(grouped);
    }, [filteredOptions, groupBy]);

    // Handle change event
    const handleChange = (event: SelectChangeEvent<unknown>) => {
      const newValue = event.target.value;
      const changeEvent = event as SelectChangeEvent;
      onChange?.(newValue as string | number | string[] | number[], changeEvent);
    };

    // Handle clear
    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      const changeEvent = {} as SelectChangeEvent;
      onChange?.(multiple ? [] : '', changeEvent);
    };

    // Handle search
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };

    // Render value for multiple selection
    const renderMultipleValue = (selected: unknown) => {
      if (renderValue && Array.isArray(selected)) {
        return renderValue(selected as string[] | number[]);
      }

      const selectedArray = Array.isArray(selected) ? selected : [];
      if (selectedArray.length === 0) {
        return placeholder ? <em>{placeholder}</em> : '';
      }

      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedArray.map((val) => {
            const option = options.find(opt => opt.value === val);
            return (
              <Chip
                key={val}
                label={option?.label || val}
                size="small"
                sx={{
                  height: size === 'small' ? 20 : 24,
                  fontSize: size === 'small' ? '0.75rem' : '0.875rem'
                }}
              />
            );
          })}
        </Box>
      );
    };

    // Get input component based on variant
    const getInputComponent = () => {
      switch (variant) {
        case 'filled':
          return FilledInput;
        case 'standard':
          return Input;
        default:
          return OutlinedInput;
      }
    };

    const InputComponent = getInputComponent();

    // Render options
    const renderOptions = () => {
      if (children) return children;

      if (groupBy && groupedOptions.length > 0) {
        return groupedOptions.map(([groupName, groupOptions]) => [
          <ListSubheader key={groupName}>{groupName}</ListSubheader>,
          ...groupOptions.map((option: SelectOption) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: success 
                    ? `${colorTokens.success[40]}15`
                    : `${colorTokens.primary[40]}15`,
                },
              }}
            >
              {multiple && (
                <CheckIcon
                  sx={{
                    visibility: Array.isArray(value) && value.includes(option.value as string) ? 'visible' : 'hidden',
                    marginRight: 1,
                    fontSize: '1.2rem',
                    color: success ? colorTokens.success[40] : colorTokens.primary[40],
                  }}
                />
              )}
              {option.label}
            </MenuItem>
          ))
        ]).flat();
      }

      if (filteredOptions.length === 0) {
        return (
          <MenuItem disabled>
            <em>{noOptionsText}</em>
          </MenuItem>
        );
      }

      return filteredOptions.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          sx={{
            '&.Mui-selected': {
              backgroundColor: success 
                ? `${colorTokens.success[40]}15`
                : `${colorTokens.primary[40]}15`,
            },
          }}
        >
          {multiple && (
            <CheckIcon
              sx={{
                visibility: Array.isArray(value) && (value as any[]).includes(option.value) ? 'visible' : 'hidden',
                marginRight: 1,
                fontSize: '1.2rem',
                color: success ? colorTokens.success[40] : colorTokens.primary[40],
              }}
            />
          )}
          {option.label}
        </MenuItem>
      ));
    };

    // Get state color
    const getStateColor = () => {
      if (error) return colorTokens.error[40];
      if (success) return colorTokens.success[40];
      return colorTokens.primary[40];
    };

    return (
      <FormControl
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        error={error}
        required={required}
        disabled={disabled}
        ref={ref}
        sx={{
          ...inputStyles.outlined(theme => ({ palette: { mode: 'light' } } as any)),
          ...(error && stateStyles.error(theme => ({ palette: { mode: 'light' } } as any))),
          ...(success && stateStyles.success(theme => ({ palette: { mode: 'light' } } as any))),
          ...(disabled && stateStyles.disabled),
        }}
        {...FormControlProps}
      >
        {label && (
          <InputLabel
            id={labelId}
            sx={{
              color: getStateColor(),
              '&.Mui-focused': {
                color: getStateColor(),
              },
            }}
            {...InputLabelProps}
          >
            {label}
          </InputLabel>
        )}

        <MuiSelect
          labelId={label ? labelId : undefined}
          id={selectId}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          multiple={multiple}
          displayEmpty={displayEmpty}
          native={native}
          autoWidth={autoWidth}
          onOpen={() => setIsOpen(true)}
          onClose={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
          renderValue={multiple ? renderMultipleValue : (renderValue as any)}
          input={
            <InputComponent
              label={label}
              notched={variant === 'outlined' && Boolean(label)}
              endAdornment={
                <>
                  {loading && (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  )}
                  {clearable && value && !disabled && !loading && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClear}
                        edge="end"
                        sx={{ marginRight: -0.5 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              }
            />
          }
          IconComponent={ExpandMoreIcon}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 250,
                '& .MuiMenuItem-root': {
                  fontSize: size === 'small' ? '0.875rem' : '1rem',
                  minHeight: size === 'small' ? 32 : 40,
                },
              },
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          sx={[
            {
              '& .MuiSelect-select': {
                paddingRight: '40px !important',
                minHeight: size === 'small' ? '1.25rem' : '1.5rem',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: getStateColor(),
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: getStateColor(),
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: getStateColor(),
                borderWidth: 2,
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...selectProps}
        >
          {searchable && isOpen && (
            <MenuItem
              disableRipple
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'background.paper',
                zIndex: 1,
                borderBottom: 1,
                borderBottomColor: 'divider',
                '&:hover': {
                  backgroundColor: 'background.paper',
                },
              }}
            >
              <TextField
                size="small"
                placeholder="検索..."
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                  },
                }}
              />
            </MenuItem>
          )}
          {displayEmpty && !multiple && (
            <MenuItem value="">
              <em>{placeholder || 'なし'}</em>
            </MenuItem>
          )}
          {renderOptions()}
        </MuiSelect>

        {helperText && (
          <FormHelperText
            id={helperTextId}
            sx={{
              color: getStateColor(),
              margin: `${spacingTokens.xs}px 0 0 0`,
            }}
            {...FormHelperTextProps}
          >
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

StandardSelect.displayName = 'StandardSelect';

export default StandardSelect;
