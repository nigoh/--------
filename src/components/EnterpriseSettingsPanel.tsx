/**
 * Enterprise Settings Panel
 * 
 * Material Design 3準拠の設定パネル
 * デザインシステムテーマの動的切り替え機能付き
 */

import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  Box,
  Switch,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Divider,
  Chip,
  Stack,
  Button,
  Card,
  CardContent,
  useTheme,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
  Palette as PaletteIcon,
  Contrast as ContrastIcon,
  FormatSize as FormatSizeIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AutoMode as AutoModeIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import { 
  FadeIn, 
  SlideUp, 
  StaggerContainer, 
  StaggerItem, 
  HoverAnimation 
} from './ui/Animation/MotionComponents';
import { 
  surfaceStyles, 
  buttonStyles 
} from '../theme/componentStyles';
import { spacingTokens, shapeTokens } from '../theme/designSystem';

/**
 * Enterprise Settings Panel Component
 */
export const EnterpriseSettingsPanel: React.FC = () => {
  const theme = useTheme();
  const {
    isDarkMode,
    toggleDarkMode,
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
  } = useThemeContext();

  const [isOpen, setIsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'system' | 'light' | 'dark'>('system');

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
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
    setPreviewMode('system');
  };

  return (
    <>
      {/* 設定ボタン */}
      <HoverAnimation hoverScale={1.1} hoverY={-2}>
        <Tooltip title="設定" placement="left" TransitionComponent={Zoom}>
          <IconButton
            onClick={toggleDrawer}
            sx={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 1300,
              ...surfaceStyles.elevated(3)(theme),
              width: 56,
              height: 56,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </HoverAnimation>

      {/* 設定パネル */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            ...surfaceStyles.glassmorphism(theme),
            border: 'none',
          },
        }}
      >
        <FadeIn>
          <Box sx={{ p: spacingTokens.xl }}>
            {/* ヘッダー */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: spacingTokens.lg }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                <PaletteIcon color="primary" />
                <Typography variant="h5" fontWeight="bold">
                  デザイン設定
                </Typography>
              </Box>
              <IconButton onClick={toggleDrawer}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <StaggerContainer>
              {/* テーマプレビュー */}
              <StaggerItem>
                <Card sx={{ 
                  ...surfaceStyles.elevated(2)(theme),
                  mb: spacingTokens.lg,
                  borderRadius: shapeTokens.corner.large,
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      現在のテーマ
                    </Typography>
                    <Stack direction="row" spacing={spacingTokens.sm} flexWrap="wrap" useFlexGap>
                      <Chip 
                        icon={isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                        label={isDarkMode ? 'ダーク' : 'ライト'}
                        color="primary"
                      />
                      {isHighContrast && (
                        <Chip 
                          icon={<AccessibilityIcon />}
                          label="高コントラスト"
                          color="secondary"
                        />
                      )}
                      <Chip 
                        icon={<FormatSizeIcon />}
                        label={`フォント: ${fontSize === 'small' ? '小' : fontSize === 'large' ? '大' : '中'}`}
                        variant="outlined"
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </StaggerItem>

              {/* ダークモード切り替え */}
              <StaggerItem>
                <Box sx={{ mb: spacingTokens.xl }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                      {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                      <Typography variant="h6">ダークモード</Typography>
                    </Box>
                    <Switch
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                      color="primary"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: spacingTokens.xs }}>
                    暗い環境での視認性を向上させます
                  </Typography>
                </Box>
              </StaggerItem>

              <Divider sx={{ my: spacingTokens.lg }} />

              {/* 高コントラストモード */}
              <StaggerItem>
                <Box sx={{ mb: spacingTokens.xl }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                      <AccessibilityIcon />
                      <Typography variant="h6">高コントラスト</Typography>
                    </Box>
                    <Switch
                      checked={isHighContrast}
                      onChange={toggleHighContrast}
                      color="secondary"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: spacingTokens.xs }}>
                    視覚的なアクセシビリティを向上させます
                  </Typography>
                </Box>
              </StaggerItem>

              <Divider sx={{ my: spacingTokens.lg }} />

              {/* フォントサイズ調整 */}
              <StaggerItem>
                <Box sx={{ mb: spacingTokens.xl }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm, mb: spacingTokens.md }}>
                    <FormatSizeIcon />
                    <Typography variant="h6">フォントサイズ</Typography>
                  </Box>
                  <Slider
                    value={getFontSizeValue()}
                    onChange={handleFontSizeChange}
                    min={0}
                    max={2}
                    step={1}
                    marks={fontSizeMarks}
                    valueLabelDisplay="off"
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      },
                      '& .MuiSlider-track': {
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: spacingTokens.xs }}>
                    テキストの読みやすさを調整します
                  </Typography>
                </Box>
              </StaggerItem>

              <Divider sx={{ my: spacingTokens.lg }} />

              {/* デザインシステム情報 */}
              <StaggerItem>
                <Card sx={{ 
                  ...surfaceStyles.elevated(1)(theme),
                  mb: spacingTokens.lg,
                  borderRadius: shapeTokens.corner.medium,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Material Design 3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      このアプリケーションはMaterial Design 3の設計原則に基づいて構築されており、
                      アクセシビリティとユーザビリティを重視しています。
                    </Typography>
                  </CardContent>
                </Card>
              </StaggerItem>

              {/* リセットボタン */}
              <StaggerItem>
                <Stack spacing={spacingTokens.md}>
                  <HoverAnimation hoverScale={1.02}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={resetToDefaults}
                      sx={{
                        ...buttonStyles.outlined(theme),
                        borderRadius: shapeTokens.corner.large,
                        height: 48,
                      }}
                    >
                      デフォルトに戻す
                    </Button>
                  </HoverAnimation>
                </Stack>
              </StaggerItem>
            </StaggerContainer>
          </Box>
        </FadeIn>
      </Drawer>
    </>
  );
};

export default EnterpriseSettingsPanel;
