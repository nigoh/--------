import React, { useEffect, useRef, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Box, 
  Button, 
  Typography,
  useTheme,
  Slide,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Tooltip,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { TransitionProps } from '@mui/material/transitions';
import { soundManager } from './SoundManager';
import { useTimerShortcuts, TIMER_SHORTCUTS_HELP } from './useTimerShortcuts';

// ===== 型定義 =====
interface TimerModalProps {
  open: boolean;
  onClose: () => void;
  seconds: number;
  running: boolean;
  onFinish?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onTimeChange?: (newSeconds: number) => void;
  title?: string;
}

// ===== Transition コンポーネント =====
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * 時計のような時間選択コンポーネント
 */
const ClockTimePicker: React.FC<{
  selectedMinutes: number;
  selectedSeconds: number;
  onTimeChange: (minutes: number, seconds: number) => void;
  theme: any;
}> = ({ selectedMinutes, selectedSeconds, onTimeChange, theme }) => {
  const minuteOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60];
  const secondOptions = [0, 15, 30, 45];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      p: 3,
      backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.grey[800] 
        : theme.palette.grey[50],
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      maxWidth: 500,
      mx: 'auto',
    }}>
      <Typography variant="h6" sx={{ 
        color: theme.palette.text.primary,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        <AccessTimeIcon /> 時間を選択
      </Typography>

      {/* 分の選択 */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ 
          mb: 2, 
          color: theme.palette.text.secondary,
          fontWeight: 600 
        }}>
          分
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          maxWidth: 300,
        }}>
          {minuteOptions.map((minutes) => (
            <Button
              key={minutes}
              variant={selectedMinutes === minutes ? "contained" : "outlined"}
              onClick={() => onTimeChange(minutes, selectedSeconds)}
              sx={{
                minWidth: 60,
                height: 60,
                borderRadius: '50%',
                fontSize: '1rem',
                fontWeight: 600,
                border: `2px solid ${theme.palette.primary.main}`,
                ...(selectedMinutes === minutes && {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                  transform: 'scale(1.1)',
                }),
                '&:hover': {
                  transform: selectedMinutes === minutes ? 'scale(1.1)' : 'scale(1.05)',
                  boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {minutes}
            </Button>
          ))}
        </Box>
      </Box>

      {/* 秒の選択 */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ 
          mb: 2, 
          color: theme.palette.text.secondary,
          fontWeight: 600 
        }}>
          秒
        </Typography>
        <Box sx={{ 
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {secondOptions.map((seconds) => (
            <Button
              key={seconds}
              variant={selectedSeconds === seconds ? "contained" : "outlined"}
              onClick={() => onTimeChange(selectedMinutes, seconds)}
              sx={{
                minWidth: 60,
                height: 60,
                borderRadius: '50%',
                fontSize: '1rem',
                fontWeight: 600,
                border: `2px solid ${theme.palette.secondary.main}`,
                ...(selectedSeconds === seconds && {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  color: theme.palette.secondary.contrastText,
                  boxShadow: `0 4px 12px ${theme.palette.secondary.main}40`,
                  transform: 'scale(1.1)',
                }),
                '&:hover': {
                  transform: selectedSeconds === seconds ? 'scale(1.1)' : 'scale(1.05)',
                  boxShadow: `0 6px 16px ${theme.palette.secondary.main}60`,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {seconds}
            </Button>
          ))}
        </Box>
      </Box>

      {/* 選択時間の表示 */}
      <Box sx={{ 
        textAlign: 'center',
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.primary.main}`,
        boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
      }}>
        <Typography variant="h5" sx={{ 
          fontFamily: 'monospace',
          fontWeight: 700,
          color: theme.palette.primary.main,
        }}>
          {selectedMinutes}:{selectedSeconds.toString().padStart(2, '0')}
        </Typography>
        <Typography variant="caption" sx={{ 
          color: theme.palette.text.secondary,
          fontWeight: 500,
        }}>
          選択された時間
        </Typography>
      </Box>
    </Box>
  );
};

/**
 * 円形プログレスインジケーター（最適化版）
 */
const OptimizedCircularProgress: React.FC<{
  progress: number;
  size: number;
  thickness: number;
  isUrgent: boolean;
  isFinished: boolean;
  theme: any;
}> = ({ progress, size, thickness, isUrgent, isFinished, theme }) => {
  const getColor = () => {
    if (isFinished) return theme.palette.error.main;
    if (isUrgent) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* 背景円 */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{
          color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
          position: 'absolute',
          opacity: 0.3,
        }}
      />
      {/* プログレス円 */}
      <CircularProgress
        variant="determinate"
        value={Math.min(100, Math.max(0, progress))}
        size={size}
        thickness={thickness}
        sx={{
          color: getColor(),
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: isUrgent || isFinished ? `drop-shadow(0 0 12px ${getColor()}60)` : 'none',
          transform: 'rotate(-90deg) !important',
          ...(isUrgent && {
            animation: 'urgentPulse 1.5s ease-in-out infinite',
            '@keyframes urgentPulse': {
              '0%, 100%': { filter: `drop-shadow(0 0 8px ${getColor()}60)` },
              '50%': { filter: `drop-shadow(0 0 16px ${getColor()}80)` },
            },
          }),
        }}
      />
    </Box>
  );
};

/**
 * 最適化されたタイマーモーダルコンポーネント
 */
export default function TimerModal({ 
  open, 
  onClose, 
  seconds, 
  running, 
  onFinish, 
  onStart, 
  onPause, 
  onReset,
  onTimeChange,
  title = "タイマー"
}: TimerModalProps) {
  const theme = useTheme();
  const [mode, setMode] = useState<'timer' | 'picker'>('timer');
  const [localTimeLeft, setLocalTimeLeft] = useState(seconds);
  const [initialTime, setInitialTime] = useState(seconds);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastWarningTime, setLastWarningTime] = useState<number | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);

  // 外部からの変更を同期
  useEffect(() => {
    if (open) {
      setLocalTimeLeft(seconds);
      setInitialTime(seconds);
    }
  }, [seconds, open]);

  // タイマー実行ロジック（最適化版 + 音声フィードバック）
  useEffect(() => {
    if (running && open && localTimeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setLocalTimeLeft((prev: number) => {
          const newTime = Math.max(0, prev - 1);
          
          // 音声フィードバック
          if (soundEnabled) {
            // 完了音
            if (newTime === 0 && onFinish) {
              soundManager.playCompletionSound();
              onFinish();
            }
            // 警告音（30秒前、1回のみ）
            else if (newTime === 30 && lastWarningTime !== 30) {
              soundManager.playWarningSound();
              setLastWarningTime(30);
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, open, localTimeLeft, onFinish, soundEnabled, lastWarningTime]);

  // イベントハンドラー（最適化）
  const handleStart = () => {
    if (onStart) onStart();
  };

  const handlePause = () => {
    if (onPause) onPause();
  };

  const handleReset = () => {
    // 実行中の場合は一時停止してからリセット
    if (running && onPause) {
      onPause();
    }
    setLocalTimeLeft(initialTime);
    setLastWarningTime(null); // 警告音リセット
    if (onReset) onReset();
  };

  // キーボードショートカット
  useTimerShortcuts({
    onStart: handleStart,
    onPause: handlePause,
    onReset: handleReset,
    onClose: onClose
  }, open);

  // 計算値（最適化）
  const minutes = Math.floor(localTimeLeft / 60);
  const secondsLeft = localTimeLeft % 60;
  const progress = initialTime > 0 
    ? ((initialTime - localTimeLeft) / initialTime) * 100 
    : 0;
  const isUrgent = localTimeLeft <= 30 && localTimeLeft > 0;
  const isFinished = localTimeLeft === 0;

  // 選択時間の状態
  const selectedMinutes = Math.floor(localTimeLeft / 60);
  const selectedSeconds = localTimeLeft % 60;

  const handleTimePickerChange = (minutes: number, seconds: number) => {
    const newTotalSeconds = minutes * 60 + seconds;
    setLocalTimeLeft(newTotalSeconds);
    setInitialTime(newTotalSeconds);
    if (onTimeChange) {
      onTimeChange(newTotalSeconds);
    }
  };

  const handleModeToggle = (_: any, newMode: 'timer' | 'picker') => {
    if (newMode) {
      setMode(newMode);
    }
  };

  // UI状態の計算
  const getButtonState = () => {
    if (isFinished) return { text: '完了', disabled: true, action: () => {} };
    if (running) return { text: '一時停止', disabled: false, action: handlePause };
    return { text: 'スタート', disabled: false, action: handleStart };
  };

  const buttonState = getButtonState();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      keepMounted
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          border: `2px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[16],
          minHeight: 500,
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
        }
      }}
    >
      {/* ヘッダー */}
      <DialogTitle sx={{ 
        background: theme.palette.mode === 'dark' 
          ? theme.palette.grey[800] 
          : theme.palette.grey[100],
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <Box 
              sx={{ 
                width: 6, 
                height: 24, 
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 3
              }} 
            />
            <AccessTimeIcon sx={{ fontSize: 20 }} />
            {title}
          </Typography>
          
          {/* モード切替ボタン */}
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeToggle}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: 2,
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'none',
                border: `1px solid ${theme.palette.primary.main}`,
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  }
                },
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}10`,
                }
              }
            }}
          >
            <ToggleButton value="timer">タイマー</ToggleButton>
            <ToggleButton value="picker">時間選択</ToggleButton>
          </ToggleButtonGroup>

          {/* 音声制御ボタン */}
          <Tooltip title={soundEnabled ? "音声を無効化" : "音声を有効化"}>
            <IconButton
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                soundManager.toggleSound(!soundEnabled);
              }}
              size="small"
              sx={{
                color: soundEnabled ? theme.palette.success.main : theme.palette.text.disabled,
                '&:hover': {
                  backgroundColor: `${theme.palette.success.main}10`,
                }
              }}
            >
              {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Tooltip>

          {/* キーボードショートカットヘルプ */}
          <Tooltip title="キーボードショートカット">
            <IconButton
              onClick={() => setShowShortcuts(!showShortcuts)}
              size="small"
              sx={{
                color: theme.palette.info.main,
                '&:hover': {
                  backgroundColor: `${theme.palette.info.main}10`,
                }
              }}
            >
              <KeyboardIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <IconButton 
          onClick={onClose}
          sx={{
            backgroundColor: theme.palette.action.hover,
            '&:hover': {
              backgroundColor: theme.palette.action.selected,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* メインコンテンツ */}
      <DialogContent sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 6,
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        minHeight: 600,
      }}>
        {/* キーボードショートカットヘルプ */}
        {showShortcuts && (
          <Box sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            zIndex: 1000,
            maxWidth: 250,
            boxShadow: theme.shadows[8],
          }}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: theme.palette.text.primary,
            }}>
              ⌨️ キーボードショートカット
            </Typography>
            {TIMER_SHORTCUTS_HELP.map((shortcut) => (
              <Box key={shortcut.key} sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}>
                <Chip 
                  label={shortcut.key} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 20,
                    minWidth: 60,
                  }}
                />
                <Typography variant="caption" sx={{ 
                  color: theme.palette.text.secondary,
                  ml: 1,
                  fontSize: '0.75rem',
                }}>
                  {shortcut.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* タイマー実行状態のデータ属性 */}
        <Box data-timer-running={running} sx={{ display: 'none' }} />
        {mode === 'timer' ? (
          // タイマー表示モード
          <>
            {/* タイマー表示 */}
            <Box sx={{ 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 4,
            }}>
              <OptimizedCircularProgress
                progress={progress}
                size={360}
                thickness={4}
                isUrgent={isUrgent}
                isFinished={isFinished}
                theme={theme}
              />
              
              {/* タイマー数字とプログレス */}
              <Box sx={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}>
                <Typography sx={{ 
                  fontSize: { xs: '4rem', sm: '5rem', md: '6rem' }, 
                  fontWeight: 800, 
                  fontFamily: 'monospace',
                  color: isFinished 
                    ? theme.palette.error.main
                    : isUrgent 
                      ? theme.palette.warning.main
                      : theme.palette.text.primary,
                  lineHeight: 0.9,
                  mb: 1,
                  ...(isUrgent && {
                    animation: 'timerPulse 1.5s ease-in-out infinite',
                    '@keyframes timerPulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }),
                }}>
                  {minutes}:{secondsLeft.toString().padStart(2, '0')}
                </Typography>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {Math.round(progress)}%
                </Typography>
              </Box>
            </Box>

            {/* ステータス表示 */}
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                color: isFinished 
                  ? theme.palette.error.main
                  : running 
                    ? theme.palette.success.main
                    : theme.palette.text.secondary,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {isFinished 
                ? '⏰ 時間終了！' 
                : running 
                  ? '🏃 実行中...' 
                  : '⏸️ 待機中'}
            </Typography>

            {/* コントロールボタン */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {/* メインボタン (スタート/一時停止) */}
              <Button
                variant="contained"
                onClick={buttonState.action}
                startIcon={running ? <PauseIcon /> : <PlayArrowIcon />}
                size="large"
                disabled={buttonState.disabled}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  background: running 
                    ? `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
                    : `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                  color: theme.palette.getContrastText(
                    running ? theme.palette.warning.main : theme.palette.success.main
                  ),
                  boxShadow: `0 4px 16px ${running ? theme.palette.warning.main : theme.palette.success.main}40`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${running ? theme.palette.warning.main : theme.palette.success.main}60`,
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabledBackground,
                    transform: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {buttonState.text}
              </Button>

              {/* リセットボタン */}
              <Button
                variant="outlined"
                onClick={handleReset}
                startIcon={<RestartAltIcon />}
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: `${theme.palette.primary.main}10`,
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                リセット
              </Button>

              {/* 時間変更ボタン */}
              <Button
                variant="text"
                onClick={() => setMode('picker')}
                startIcon={<AccessTimeIcon />}
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: `${theme.palette.secondary.main}10`,
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                時間変更
              </Button>
            </Box>
          </>
        ) : (
          // 時間選択モード
          <ClockTimePicker
            selectedMinutes={selectedMinutes}
            selectedSeconds={selectedSeconds}
            onTimeChange={handleTimePickerChange}
            theme={theme}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
