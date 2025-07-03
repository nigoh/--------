import React from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormGroup,
  FormLabel,
  Box,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { StandardCheckboxProps, CheckboxGroupProps } from './types';
import { colorTokens, spacingTokens } from '../../../theme/designSystem';

// Checkbox のスタイリング
const StyledCheckbox = styled(MuiCheckbox, {
  shouldForwardProp: (prop) => !['variant', 'state'].includes(prop as string)
})<{ variant?: string; state?: string; checkboxSize?: string }>(({ theme, variant = 'primary', state, checkboxSize = 'medium' }) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'primary': return colorTokens.primary[50];
      case 'secondary': return colorTokens.secondary[50];
      case 'success': return colorTokens.success[50];
      case 'warning': return colorTokens.warning[50];
      case 'error': return colorTokens.error[50];
      default: return colorTokens.primary[50];
    }
  };

  const getSizeStyles = () => {
    switch (checkboxSize) {
      case 'small':
        return {
          padding: spacingTokens.xs,
          '& .MuiSvgIcon-root': { fontSize: '1rem' }
        };
      case 'large':
        return {
          padding: spacingTokens.sm,
          '& .MuiSvgIcon-root': { fontSize: '1.5rem' }
        };
      default:
        return {
          padding: spacingTokens.xs,
          '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
        };
    }
  };

  return {
    ...getSizeStyles(),
    color: state === 'error' ? colorTokens.error[50] : colorTokens.neutral[50],
    
    '&.Mui-checked': {
      color: state === 'error' ? colorTokens.error[50] : getVariantColor(),
    },
    
    '&.MuiCheckbox-indeterminate': {
      color: state === 'error' ? colorTokens.error[50] : getVariantColor(),
    },
    
    '&:hover': {
      backgroundColor: state === 'disabled' ? 'transparent' : `${getVariantColor()}08`,
    },
    
    '&.Mui-disabled': {
      color: colorTokens.neutral[30],
    },
    
    '&.Mui-focusVisible': {
      boxShadow: `0 0 0 2px ${getVariantColor()}40`,
    },
    
    // 状態に応じたスタイル
    ...(state === 'error' && {
      color: colorTokens.error[50],
      '&.Mui-checked': {
        color: colorTokens.error[50],
      },
    }),
  };
});

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>(({ theme, error }) => ({
  marginLeft: 0,
  marginTop: spacingTokens.xs,
  fontSize: '0.75rem',
  color: error ? colorTokens.error[50] : colorTokens.neutral[50],
}));

// StandardCheckbox コンポーネント
export const StandardCheckbox: React.FC<StandardCheckboxProps> = ({
  label,
  helperText,
  errorText,
  size = 'medium',
  variant = 'primary',
  state = 'default',
  labelPlacement = 'end',
  fullWidth = false,
  required = false,
  disabled = false,
  indeterminate = false,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  onFocus,
  onBlur,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...muiProps
}) => {
  const isError = state === 'error' || Boolean(errorText);
  const isDisabled = state === 'disabled' || disabled;
  
  const checkboxElement = (
    <StyledCheckbox
      {...muiProps}
      variant={variant}
      state={state}
      checkboxSize={size}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={isDisabled}
      indeterminate={indeterminate}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );

  if (!label) {
    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
        {checkboxElement}
        {(helperText || errorText) && (
          <StyledFormHelperText error={isError}>
            {errorText || helperText}
          </StyledFormHelperText>
        )}
      </Box>
    );
  }

  return (
    <FormControl 
      component="fieldset" 
      error={isError}
      disabled={isDisabled}
      required={required}
      fullWidth={fullWidth}
    >
      <FormControlLabel
        control={checkboxElement}
        label={label}
        labelPlacement={labelPlacement}
        sx={{
          margin: 0,
          alignItems: labelPlacement === 'top' || labelPlacement === 'bottom' ? 'flex-start' : 'center',
          '& .MuiFormControlLabel-label': {
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
            color: isDisabled ? colorTokens.neutral[30] : colorTokens.neutral[10],
            ...(required && {
              '&::after': {
                content: '" *"',
                color: colorTokens.error[50],
              }
            })
          }
        }}
      />
      {(helperText || errorText) && (
        <StyledFormHelperText error={isError}>
          {errorText || helperText}
        </StyledFormHelperText>
      )}
    </FormControl>
  );
};

// CheckboxGroup コンポーネント
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  options,
  value = [],
  defaultValue = [],
  direction = 'column',
  size = 'medium',
  variant = 'primary',
  disabled = false,
  error = false,
  required = false,
  label,
  helperText,
  errorText,
  onChange,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
  const isControlled = value !== undefined;
  const currentValues = isControlled ? value : selectedValues;

  const handleChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter(v => v !== optionValue);
    
    if (!isControlled) {
      setSelectedValues(newValues);
    }
    
    onChange?.(newValues);
  };

  return (
    <FormControl component="fieldset" error={error} disabled={disabled} required={required}>
      {label && (
        <FormLabel 
          component="legend"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          sx={{
            fontSize: '1rem',
            fontWeight: 500,
            color: disabled ? colorTokens.neutral[30] : colorTokens.neutral[10],
            marginBottom: spacingTokens.xs,
            ...(required && {
              '&::after': {
                content: '" *"',
                color: colorTokens.error[50],
              }
            })
          }}
        >
          {label}
        </FormLabel>
      )}
      
      <FormGroup
        sx={{
          flexDirection: direction,
          gap: spacingTokens.xs,
        }}
      >
        {options.map((option) => (
          <StandardCheckbox
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            size={size}
            variant={variant}
            helperText={option.helperText}
            disabled={disabled || option.disabled}
            checked={currentValues.includes(option.value)}
            onChange={(event, checked) => handleChange(option.value, checked)}
          />
        ))}
      </FormGroup>
      
      {(helperText || errorText) && (
        <StyledFormHelperText error={Boolean(errorText)}>
          {errorText || helperText}
        </StyledFormHelperText>
      )}
    </FormControl>
  );
};

export default StandardCheckbox;
