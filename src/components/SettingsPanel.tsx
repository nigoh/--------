import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Divider,
  IconButton,
  Fade,
  keyframes,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ContrastIcon from '@mui/icons-material/Contrast';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useThemeContext } from '../contexts/ThemeContext';
import { focusStyles } from '../utils/accessibility';

// アニメーション定義
const slideIn = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const SettingsPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const {
    isDarkMode,
    toggleDarkMode,
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    isReducedMotion,
  } = useThemeContext();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* 設定ボタン */}
      <IconButton
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.05) rotate(45deg)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          },
          ...focusStyles,
        }}
        aria-label="設定を開く"
      >
        <SettingsIcon />
      </IconButton>

      {/* 設定ダイアログ */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.1)',
            animation: `${slideIn} 0.3s ease-out`,
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon />
            <Typography variant="h6" component="span">
              アプリ設定
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              ...focusStyles,
            }}
            aria-label="設定を閉じる"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* 外観設定 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <ContrastIcon />
              外観
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* ダークモード */}
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    icon={<LightModeIcon />}
                    checkedIcon={<DarkModeIcon />}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  />
                }
                label="ダークモード"
                sx={{ 
                  '& .MuiFormControlLabel-label': { 
                    fontWeight: 500 
                  } 
                }}
              />

              {/* ハイコントラスト */}
              <FormControlLabel
                control={
                  <Switch
                    checked={isHighContrast}
                    onChange={toggleHighContrast}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  />
                }
                label="ハイコントラスト"
                sx={{ 
                  '& .MuiFormControlLabel-label': { 
                    fontWeight: 500 
                  } 
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* フォントサイズ設定 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <TextFieldsIcon />
              テキスト
            </Typography>

            <FormControl fullWidth>
              <InputLabel>フォントサイズ</InputLabel>
              <Select
                value={fontSize}
                label="フォントサイズ"
                onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
                sx={{
                  '& .MuiSelect-select': {
                    fontWeight: 500,
                  },
                }}
              >
                <MenuItem value="small">小</MenuItem>
                <MenuItem value="medium">標準</MenuItem>
                <MenuItem value="large">大</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* アクセシビリティ情報 */}
          <Box>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              fontWeight: 600,
            }}>
              アクセシビリティ
            </Typography>

            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(103, 126, 234, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(103, 126, 234, 0.1)',
            }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                現在の設定:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • アニメーション: {isReducedMotion ? '簡略化' : '標準'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • フォントサイズ: {fontSize === 'small' ? '小' : fontSize === 'large' ? '大' : '標準'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • コントラスト: {isHighContrast ? '高' : '標準'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            完了
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsPanel;
