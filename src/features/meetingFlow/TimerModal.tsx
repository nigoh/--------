import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  useTheme,
  Slide,
  Tooltip,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TransitionProps } from '@mui/material/transitions';
import { soundManager } from './SoundManager';
import { useTimerShortcuts, TIMER_SHORTCUTS_HELP } from './useTimerShortcuts';
import ModeToggle from './components/ModeToggle';
import TimePickerPanel from './components/TimePickerPanel';
import TimerDisplay from './components/TimerDisplay';

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
          
          <ModeToggle
            mode={mode}
            onModeChange={handleModeToggle}
            soundEnabled={soundEnabled}
            onSoundToggle={() => {
              setSoundEnabled(!soundEnabled);
              soundManager.toggleSound(!soundEnabled);
            }}
            onToggleShortcuts={() => setShowShortcuts(!showShortcuts)}
          />
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

        <Box data-timer-running={running} sx={{ display: 'none' }} />
        {mode === 'timer' ? (
          <TimerDisplay
            progress={progress}
            minutes={minutes}
            seconds={secondsLeft}
            running={running}
            isUrgent={isUrgent}
            isFinished={isFinished}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onChangeTime={() => setMode('picker')}
          />
        ) : (
          <TimePickerPanel
            selectedMinutes={selectedMinutes}
            selectedSeconds={selectedSeconds}
            onTimeChange={handleTimePickerChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
