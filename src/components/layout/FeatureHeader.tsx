import React from 'react';
import { Box, Typography, Button, useTheme, Divider, Chip, alpha } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { spacingTokens, motionTokens } from '../../theme/designSystem';
import { gradientTokens } from '../../theme/gradients';

interface ActionButton {
  text: string;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface FeatureHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addButtonText?: string;
  actions?: React.ReactNode;
  buttons?: ActionButton[];
  showAddButton?: boolean;
  badge?: string;
  variant?: 'default' | 'elevated' | 'glass';
}

/**
 * 機能ページ共通のヘッダーコンポーネント
 * タイトル、説明、アクションボタンを統一されたスタイルで表示
 * 現代的なデザインシステムに基づく改良版
 */
export const FeatureHeader: React.FC<FeatureHeaderProps> = ({
  icon,
  title,
  subtitle,
  onAdd,
  addButtonText = '新規作成',
  actions,
  buttons = [],
  showAddButton = true,
  badge,
  variant = 'elevated',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // バリアントに応じた背景とスタイル
  const getHeaderStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          background: gradientTokens.themeAware.surfaceElevated(isDark),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        };
      case 'glass':
        return {
          background: gradientTokens.themeAware.glass(isDark),
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: `1px solid ${gradientTokens.themeAware.glassBorder(isDark)}`,
        };
      default:
        return {
          backgroundColor: theme.palette.background.paper,
        };
    }
  };

  return (
    <Box
      sx={{
        ...getHeaderStyles(),
        borderRadius: '16px',
        p: { xs: spacingTokens.md, md: spacingTokens.lg },
        mb: spacingTokens.lg,
        transition: `all ${motionTokens.duration.medium3} ${motionTokens.easing.standard}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 装飾的背景効果 */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: gradientTokens.primary.subtle,
          borderRadius: '50%',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: spacingTokens.lg,
      }}>
        {/* タイトル部分（改良版） */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: spacingTokens.sm,
            mb: spacingTokens.sm,
          }}>
            {/* アイコン */}
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: gradientTokens.primary.subtle,
                  color: theme.palette.primary.main,
                  '& svg': {
                    fontSize: '1.5rem',
                  },
                }}
              >
                {icon}
              </Box>
            )}

            {/* タイトルとバッジ */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: gradientTokens.primary.bold,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
                
                {badge && (
                  <Chip
                    label={badge}
                    size="small"
                    sx={{
                      background: gradientTokens.tertiary.subtle,
                      color: theme.palette.tertiary?.main || theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </Box>

              {subtitle && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 600,
                    lineHeight: 1.6,
                    mt: spacingTokens.xs,
                    opacity: 0.8,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* アクション部分（改良版） */}
        <Box sx={{
          display: 'flex',
          gap: spacingTokens.sm,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* カスタムアクション */}
          {actions}

          {/* 追加ボタン群 */}
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || 'outlined'}
              color={button.color || 'primary'}
              onClick={button.onClick}
              startIcon={button.icon}
              disabled={button.disabled}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: spacingTokens.lg,
                py: spacingTokens.sm,
                transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              {button.text}
            </Button>
          ))}

          {/* デフォルト追加ボタン */}
          {showAddButton && onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: spacingTokens.lg,
                py: spacingTokens.sm,
                background: gradientTokens.primary.bold,
                transition: `all ${motionTokens.duration.medium2} ${motionTokens.easing.standard}`,
                '&:hover': {
                  background: gradientTokens.primary.dark,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              {addButtonText}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
