/**
 * Enterprise Settings Panel
 * 
 * Material Design 3準拠の設定パネル
 * デザインシステムテーマの動的切り替え機能付き
 */

import React from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  Box,
  Switch,
  Slider,
  Divider,
  Chip,
  Stack,
  Button,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
  Palette as PaletteIcon,
  FormatSize as FormatSizeIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';

/**
 * Enterprise Settings Panel Component
 */
interface EnterpriseSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export const EnterpriseSettingsPanel: React.FC<EnterpriseSettingsPanelProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const {
    isDarkMode,
    toggleDarkMode,
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
  } = useThemeContext();

  const toggleDrawer = () => {
    onClose();
  };

  const fontSizeMarks = [
    { value: 0, label: 'S' },
    { value: 1, label: 'M' },
    { value: 2, label: 'L' },
  ];

  const getFontSizeValue = () => {
    switch (fontSize) {
      case 'small': return 0;
      case 'large': return 2;
      default: return 1;
    }
  };

  const handleFontSizeChange = (_: Event, value: number | number[]) => {
    const size = Array.isArray(value) ? value[0] : value;
    switch (size) {
      case 0: setFontSize('small'); break;
      case 2: setFontSize('large'); break;
      default: setFontSize('medium'); break;
    }
  };

  const resetToDefaults = () => {
    setFontSize('medium');
    if (isDarkMode) toggleDarkMode();
    if (isHighContrast) toggleHighContrast();
  };

  return (
    <>
      {/* 設定パネル */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100%', sm: 380 }, // 幅を少し縮小
              // メインカラー70% - 背景全体
              backgroundColor: theme.palette.background.paper,
              border: 'none',
              height: '100vh',
              overflow: 'hidden', // 外側のスクロールを無効化
              display: 'flex',
              flexDirection: 'column',
            },
          }
        }}
      >
        {/* ヘッダー - セカンダリカラー25% */}
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ 
            p: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.grey[800] 
              : theme.palette.grey[50],
            borderBottom: `1px solid ${theme.palette.divider}`,
            flexShrink: 0, // ヘッダーの高さを固定
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* アクセントカラー5% - アイコン */}
            <PaletteIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
            <Typography 
              variant="h6" 
              fontWeight="bold"
              sx={{ color: theme.palette.text.primary }}
            >
              デザイン設定
            </Typography>
          </Box>
          <IconButton 
            onClick={toggleDrawer}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* スクロール可能なコンテンツエリア */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.divider,
              borderRadius: '3px',
            },
          }}
        >
          {/* コンテンツ - メインカラー70% */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* テーマプレビュー - セカンダリカラー25% */}
            <Card sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[800] 
                : theme.palette.grey[50],
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom
                  sx={{ color: theme.palette.text.primary, mb: 1 }}
                >
                  現在のテーマ
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {/* アクセントカラー5% - チップ */}
                  <Chip 
                    icon={isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                    label={isDarkMode ? 'ダーク' : 'ライト'}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      }
                    }}
                  />
                  {isHighContrast && (
                    <Chip 
                      icon={<AccessibilityIcon />}
                      label="高コントラスト"
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.dark,
                        }
                      }}
                    />
                  )}
                  <Chip 
                    icon={<FormatSizeIcon />}
                    label={`フォント${fontSize === 'small' ? '小' : fontSize === 'large' ? '大' : '中'}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '10',
                      }
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* 設定項目のコンパクト化 */}
            {/* ダークモード */}
            <Box sx={{ py: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isDarkMode ? 
                    <DarkModeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} /> : 
                    <LightModeIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                  }
                  <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                    ダークモード
                  </Typography>
                </Box>
                <Switch
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
              </Stack>
            </Box>

            <Divider sx={{ 
              borderColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[700] 
                : theme.palette.grey[300] 
            }} />

            {/* 高コントラストモード */}
            <Box sx={{ py: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessibilityIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />
                  <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                    高コントラスト
                  </Typography>
                </Box>
                <Switch
                  checked={isHighContrast}
                  onChange={toggleHighContrast}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.secondary.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.palette.secondary.main,
                    },
                  }}
                />
              </Stack>
            </Box>

            <Divider sx={{ 
              borderColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[700] 
                : theme.palette.grey[300] 
            }} />

            {/* フォントサイズ調整 */}
            <Box sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FormatSizeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                  フォントサイズ
                </Typography>
              </Box>
              <Slider
                value={getFontSizeValue()}
                onChange={handleFontSizeChange}
                min={0}
                max={2}
                step={1}
                marks={fontSizeMarks}
                valueLabelDisplay="off"
                size="small"
                sx={{
                  color: theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      boxShadow: `0 0 0 8px ${theme.palette.primary.main}20`,
                    }
                  },
                  '& .MuiSlider-track': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                  '& .MuiSlider-markLabel': {
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem',
                  }
                }}
              />
            </Box>

            <Divider sx={{ 
              borderColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[700] 
                : theme.palette.grey[300] 
            }} />

            {/* デザインシステム情報 - コンパクト版 */}
            <Card sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[800] 
                : theme.palette.grey[50],
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '3px',
                height: '100%',
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }}>
              <CardContent sx={{ p: 2, pl: 2.5, '&:last-child': { pb: 2 } }}>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{ color: theme.palette.text.primary, mb: 0.5 }}
                >
                  Material Design 3
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    lineHeight: 1.3,
                    display: 'block'
                  }}
                >
                  70:25:5配色法則とMD3設計原則に基づく、アクセシビリティ重視の設計
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* フッター：リセットボタン - アクセントカラー5% */}
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, flexShrink: 0 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={resetToDefaults}
            size="small"
            sx={{
              borderRadius: 2,
              height: 40,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}50`,
              },
              '&:active': {
                transform: 'translateY(0px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            デフォルトに戻す
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default EnterpriseSettingsPanel;
