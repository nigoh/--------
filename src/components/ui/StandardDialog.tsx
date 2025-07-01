import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Slide,
  Fade
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Close as CloseIcon } from '@mui/icons-material';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';

// スライドトランジション
const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// フェードトランジション
const FadeTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} />;
});

// ダイアログサイズ定義
export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fullWidth';

// ダイアログバリアント定義
export type DialogVariant = 'standard' | 'form' | 'confirmation' | 'fullscreen';

// アニメーションタイプ定義
export type DialogAnimation = 'slide' | 'fade' | 'none';

interface StandardDialogProps {
  // 基本Props
  open: boolean;
  onClose: () => void;
  
  // コンテンツ
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  
  // スタイリング
  size?: DialogSize;
  variant?: DialogVariant;
  animation?: DialogAnimation;
  
  // 機能制御
  disableClose?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  
  // カスタマイズ
  maxWidth?: number | string;
  fullScreen?: boolean;
  
  // アクセシビリティ
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export const StandardDialog: React.FC<StandardDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  size = 'md',
  variant = 'standard',
  animation = 'slide',
  disableClose = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  maxWidth,
  fullScreen: customFullScreen,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // レスポンシブ対応
  const fullScreen = customFullScreen || (variant === 'fullscreen') || isMobile;
  
  // サイズマッピング
  const getSizeProps = () => {
    if (maxWidth) {
      return { 
        maxWidth: false as const, 
        sx: { 
          '& .MuiDialog-paper': { 
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth 
          } 
        } 
      };
    }
    
    const sizeMap = {
      xs: 'xs' as const,
      sm: 'sm' as const,
      md: 'md' as const,
      lg: 'lg' as const,
      xl: 'xl' as const,
      fullWidth: false as const
    };
    
    return { maxWidth: sizeMap[size] };
  };
  
  // アニメーション選択
  const getTransitionComponent = () => {
    if (fullScreen) return SlideTransition;
    
    switch (animation) {
      case 'slide': return SlideTransition;
      case 'fade': return FadeTransition;
      case 'none': return undefined;
      default: return SlideTransition;
    }
  };
  
  // バリアント別スタイル
  const getVariantStyles = () => {
    const baseStyles = {
      '& .MuiDialog-paper': {
        borderRadius: fullScreen ? 0 : shapeTokens.corner.large,
        boxShadow: theme.shadows[8],
      }
    };
    
    switch (variant) {
      case 'form':
        return {
          ...baseStyles,
          '& .MuiDialog-paper': {
            ...baseStyles['& .MuiDialog-paper'],
            minHeight: '400px',
          }
        };
      case 'confirmation':
        return {
          ...baseStyles,
          '& .MuiDialog-paper': {
            ...baseStyles['& .MuiDialog-paper'],
            textAlign: 'center' as const,
          }
        };
      case 'fullscreen':
        return {
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            borderRadius: 0,
          }
        };
      default:
        return baseStyles;
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={disableBackdropClick ? undefined : onClose}
      TransitionComponent={getTransitionComponent()}
      fullScreen={fullScreen}
      disableEscapeKeyDown={disableEscapeKeyDown}
      aria-labelledby={ariaLabelledby || 'dialog-title'}
      aria-describedby={ariaDescribedby || 'dialog-content'}
      sx={{
        ...getVariantStyles(),
        ...getSizeProps().sx
      }}
      {...getSizeProps()}
    >
      {/* ヘッダー */}
      {(title || !disableClose) && (
        <>
          <DialogTitle
            id="dialog-title"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: spacingTokens.md,
              px: spacingTokens.lg,
              minHeight: '64px'
            }}
          >
            <Box>
              {title && (
                <Typography 
                  variant="h6" 
                  component="h2"
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    mt: 0.5
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            
            {!disableClose && (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <Divider />
        </>
      )}
      
      {/* コンテンツ */}
      <DialogContent
        id="dialog-content"
        sx={{
          px: spacingTokens.lg,
          py: spacingTokens.md,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: spacingTokens.md
        }}
      >
        {children}
      </DialogContent>
      
      {/* アクション */}
      {actions && (
        <>
          <Divider />
          <DialogActions
            sx={{
              px: spacingTokens.lg,
              py: spacingTokens.md,
              gap: spacingTokens.sm,
              justifyContent: variant === 'confirmation' ? 'center' : 'flex-end'
            }}
          >
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
