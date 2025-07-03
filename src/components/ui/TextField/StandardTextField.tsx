import React, { useState, useCallback } from 'react';
import {
  TextField as MuiTextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { StandardTextFieldProps } from './types';
import { inputStyles } from '../../../theme/componentStyles';
import { spacingTokens } from '../../../theme/designSystem';

/**
 * 統一されたテキストフィールドコンポーネント
 * プロジェクト全体で使用する基本入力フィールド
 */
const StandardTextField: React.FC<StandardTextFieldProps> = ({
  size = 'medium',
  variant = 'outlined',
  error,
  errorMessage,
  success = false,
  helperText,
  showCharacterCount = false,
  maxLength,
  clearable = false,
  onClear,
  value,
  onChange,
  sx,
  InputProps,
  ...props
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  // 文字数計算
  const currentLength = typeof value === 'string' ? value.length : 0;
  const isOverLimit = maxLength ? currentLength > maxLength : false;

  // クリアハンドラー
  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      // @ts-ignore
      onChange({ target: { value: '' } });
    }
  }, [onClear, onChange]);

  // エンドアドーメント作成
  const getEndAdornment = () => {
    const adornments: React.ReactNode[] = [];

    // 成功アイコン
    if (success && !error) {
      adornments.push(
        <CheckCircleIcon
          key="success"
          sx={{ 
            color: theme.palette.success.main,
            fontSize: size === 'small' ? '1.2rem' : '1.5rem'
          }}
        />
      );
    }

    // クリアボタン
    if (clearable && value && !props.disabled) {
      adornments.push(
        <IconButton
          key="clear"
          size="small"
          onClick={handleClear}
          sx={{
            p: size === 'small' ? 0.5 : 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.action.hover, 0.1),
            },
          }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      );
    }

    return adornments.length > 0 ? (
      <InputAdornment position="end">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {adornments}
        </Box>
      </InputAdornment>
    ) : InputProps?.endAdornment;
  };

  // ヘルパーテキスト作成
  const getHelperText = () => {
    const components: React.ReactNode[] = [];

    // エラーメッセージ
    if (error && errorMessage) {
      components.push(
        <Typography
          key="error"
          variant="caption"
          color="error"
          component="span"
        >
          {errorMessage}
        </Typography>
      );
    } else if (helperText) {
      components.push(
        <Typography
          key="helper"
          variant="caption"
          color="text.secondary"
          component="span"
        >
          {helperText}
        </Typography>
      );
    }

    // 文字数カウンター
    if (showCharacterCount) {
      components.push(
        <Typography
          key="count"
          variant="caption"
          color={isOverLimit ? 'error' : 'text.secondary'}
          component="span"
          sx={{ ml: 'auto' }}
        >
          {currentLength}{maxLength ? `/${maxLength}` : ''}
        </Typography>
      );
    }

    return components.length > 0 ? (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        {components}
      </Box>
    ) : undefined;
  };

  // スタイル取得
  const getTextFieldStyles = () => {
    const baseStyle = variant === 'outlined'
      ? inputStyles.outlined(theme)
      : variant === 'filled'
      ? inputStyles.filled(theme)
      : {}; // standardは現在未定義のため空オブジェクト

    const combinedStyles = {
      ...baseStyle,
      // 成功状態のスタイル
      ...(success && !error && {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.success.main,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.success.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.success.main,
          },
        },
      }),
      // オーバーリミット時のスタイル
      ...(isOverLimit && {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.error.main,
          },
        },
      }),
    };

    return combinedStyles;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <MuiTextField
        size={size}
        variant={variant}
        error={error || isOverLimit}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        InputProps={{
          ...InputProps,
          endAdornment: getEndAdornment(),
        }}
        sx={{
          ...getTextFieldStyles(),
          ...sx,
        }}
        {...props}
      />
      {getHelperText()}
    </Box>
  );
};

export default StandardTextField;
