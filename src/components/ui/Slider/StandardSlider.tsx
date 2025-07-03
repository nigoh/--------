import React from 'react';
import {
  Slider as MuiSlider,
  FormControl,
  FormHelperText,
  FormLabel,
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { StandardSliderProps } from './types';
import { colorTokens, spacingTokens } from '../../../theme/designSystem';

// Slider のスタイリング
const StyledSlider = styled(MuiSlider, {
  shouldForwardProp: (prop) => !['variant', 'state'].includes(prop as string)
})<{ variant?: string; state?: string; sliderSize?: string }>(({ theme, variant = 'primary', state, sliderSize = 'medium' }) => {
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
    switch (sliderSize) {
      case 'small':
        return {
          height: 4,
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
            '&:before': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
            },
          },
          '& .MuiSlider-track': {
            height: 4,
          },
          '& .MuiSlider-rail': {
            height: 4,
          },
        };
      case 'large':
        return {
          height: 8,
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            '&:before': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.24)',
            },
          },
          '& .MuiSlider-track': {
            height: 8,
          },
          '& .MuiSlider-rail': {
            height: 8,
          },
        };
      default:
        return {
          height: 6,
          '& .MuiSlider-thumb': {
            width: 20,
            height: 20,
            '&:before': {
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
            },
          },
          '& .MuiSlider-track': {
            height: 6,
          },
          '& .MuiSlider-rail': {
            height: 6,
          },
        };
    }
  };

  const variantColor = getVariantColor();
  const errorColor = colorTokens.error[50];

  return {
    ...getSizeStyles(),
    color: state === 'error' ? errorColor : variantColor,
    
    '& .MuiSlider-thumb': {
      backgroundColor: '#fff',
      border: `2px solid ${state === 'error' ? errorColor : variantColor}`,
      '&:hover': {
        boxShadow: `0 0 0 8px ${state === 'error' ? errorColor : variantColor}14`,
      },
      '&.Mui-focusVisible': {
        boxShadow: `0 0 0 8px ${state === 'error' ? errorColor : variantColor}30`,
      },
      '&.Mui-active': {
        boxShadow: `0 0 0 14px ${state === 'error' ? errorColor : variantColor}16`,
      },
      '&.Mui-disabled': {
        backgroundColor: colorTokens.neutral[30],
        border: `2px solid ${colorTokens.neutral[30]}`,
      },
    },
    
    '& .MuiSlider-track': {
      backgroundColor: state === 'error' ? errorColor : variantColor,
      border: 'none',
    },
    
    '& .MuiSlider-rail': {
      backgroundColor: colorTokens.neutral[40],
      opacity: 1,
    },
    
    '& .MuiSlider-mark': {
      backgroundColor: colorTokens.neutral[30],
      height: 8,
      width: 2,
      '&.MuiSlider-markActive': {
        backgroundColor: '#fff',
      },
    },
    
    '& .MuiSlider-markLabel': {
      fontSize: '0.75rem',
      color: colorTokens.neutral[50],
      top: 28,
    },
    
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: '0.75rem',
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: state === 'error' ? errorColor : variantColor,
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
  };
});

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>(({ theme, error }) => ({
  marginLeft: 0,
  marginTop: spacingTokens.xs,
  fontSize: '0.75rem',
  color: error ? colorTokens.error[50] : colorTokens.neutral[50],
}));

// StandardSlider コンポーネント
export const StandardSlider: React.FC<StandardSliderProps> = ({
  label,
  helperText,
  errorText,
  size = 'medium',
  variant = 'primary',
  state = 'default',
  fullWidth = true,
  showValue = false,
  valueFormat = (value: number) => value.toString(),
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  required = false,
  discrete = false,
  name,
  value,
  defaultValue,
  onChange,
  onChangeCommitted,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...muiProps
}) => {
  const isError = state === 'error' || Boolean(errorText);
  const isDisabled = state === 'disabled' || muiProps.disabled;
  
  const currentValue = value !== undefined ? value : (defaultValue !== undefined ? defaultValue : min);
  
  const formatValue = React.useCallback((val: number) => {
    return valueFormat(val);
  }, [valueFormat]);

  return (
    <FormControl 
      component="fieldset" 
      error={isError}
      disabled={isDisabled}
      required={required}
      fullWidth={fullWidth}
    >
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: spacingTokens.xs }}>
          <FormLabel 
            component="legend"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: isDisabled ? colorTokens.neutral[30] : colorTokens.neutral[10],
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
          {showValue && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDisabled ? colorTokens.neutral[30] : colorTokens.neutral[50],
                fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
                fontWeight: 500,
              }}
            >
              {Array.isArray(currentValue) 
                ? currentValue.map(formatValue).join(' - ')
                : formatValue(currentValue as number)
              }
            </Typography>
          )}
        </Box>
      )}
      
      <Box sx={{ px: spacingTokens.xs }}>
        <StyledSlider
          {...muiProps}
          variant={variant}
          state={state}
          sliderSize={size}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          marks={marks}
          disabled={isDisabled}
          name={name}
          onChange={onChange}
          onChangeCommitted={onChangeCommitted}
          valueLabelDisplay={discrete || showValue ? "auto" : "off"}
          valueLabelFormat={formatValue}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        />
      </Box>
      
      {(helperText || errorText) && (
        <StyledFormHelperText error={isError}>
          {errorText || helperText}
        </StyledFormHelperText>
      )}
    </FormControl>
  );
};

export default StandardSlider;
