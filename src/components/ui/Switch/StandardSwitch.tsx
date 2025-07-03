import React from 'react';
import {
  Switch as MuiSwitch,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { StandardSwitchProps } from './types';
import { colorTokens, spacingTokens } from '../../../theme/designSystem';

// Switch のスタイリング
const StyledSwitch = styled(MuiSwitch, {
  shouldForwardProp: (prop) => !['variant', 'state'].includes(prop as string)
})<{ variant?: string; state?: string; switchSize?: string }>(({ theme, variant = 'primary', state, switchSize = 'medium' }) => {
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
    switch (switchSize) {
      case 'small':
        return {
          width: 32,
          height: 18,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 1,
            '&.Mui-checked': {
              transform: 'translateX(14px)',
            },
          },
          '& .MuiSwitch-thumb': {
            width: 16,
            height: 16,
          },
          '& .MuiSwitch-track': {
            borderRadius: 9,
          },
        };
      case 'large':
        return {
          width: 58,
          height: 32,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 1,
            '&.Mui-checked': {
              transform: 'translateX(26px)',
            },
          },
          '& .MuiSwitch-thumb': {
            width: 30,
            height: 30,
          },
          '& .MuiSwitch-track': {
            borderRadius: 16,
          },
        };
      default:
        return {
          width: 48,
          height: 24,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 1,
            '&.Mui-checked': {
              transform: 'translateX(24px)',
            },
          },
          '& .MuiSwitch-thumb': {
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 12,
          },
        };
    }
  };

  const variantColor = getVariantColor();
  const errorColor = colorTokens.error[50];

  return {
    ...getSizeStyles(),
    
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(0px)',
      
      '&.Mui-checked': {
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: state === 'error' ? errorColor : variantColor,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: state === 'error' ? errorColor : variantColor,
        border: `6px solid #fff`,
      },
      
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: colorTokens.neutral[30],
      },
      
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.3,
      },
    },
    
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      color: '#fff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    
    '& .MuiSwitch-track': {
      borderRadius: switchSize === 'small' ? 9 : switchSize === 'large' ? 16 : 12,
      backgroundColor: colorTokens.neutral[40],
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 200,
      }),
    },
  };
});

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>(({ theme, error }) => ({
  marginLeft: 0,
  marginTop: spacingTokens.xs,
  fontSize: '0.75rem',
  color: error ? colorTokens.error[50] : colorTokens.neutral[50],
}));

// StandardSwitch コンポーネント
export const StandardSwitch: React.FC<StandardSwitchProps> = ({
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
  onLabel,
  offLabel,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...muiProps
}) => {
  const isError = state === 'error' || Boolean(errorText);
  const isDisabled = state === 'disabled' || disabled;
  
  const switchElement = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.xs }}>
      {offLabel && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: isDisabled ? colorTokens.neutral[30] : colorTokens.neutral[50],
            fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
          }}
        >
          {offLabel}
        </Typography>
      )}
      
      <StyledSwitch
        {...muiProps}
        variant={variant}
        state={state}
        switchSize={size}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={isDisabled}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
      
      {onLabel && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: isDisabled ? colorTokens.neutral[30] : colorTokens.neutral[50],
            fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
          }}
        >
          {onLabel}
        </Typography>
      )}
    </Box>
  );

  if (!label) {
    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
        {switchElement}
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
        control={switchElement}
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

export default StandardSwitch;
