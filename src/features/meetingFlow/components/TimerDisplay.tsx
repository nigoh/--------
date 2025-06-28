import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface TimerDisplayProps {
  progress: number;
  minutes: number;
  seconds: number;
  running: boolean;
  isUrgent: boolean;
  isFinished: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeTime: () => void;
}

const OptimizedCircularProgress: React.FC<{
  progress: number;
  size: number;
  thickness: number;
  isUrgent: boolean;
  isFinished: boolean;
}> = ({ progress, size, thickness, isUrgent, isFinished }) => {
  const theme = useTheme();
  const getColor = () => {
    if (isFinished) return theme.palette.error.main;
    if (isUrgent) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          stroke={theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]}
          strokeWidth={thickness}
          fill="none"
          opacity={0.3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          stroke={getColor()}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={Math.PI * (size - thickness)}
          strokeDashoffset={
            ((100 - Math.min(100, Math.max(0, progress))) / 100) *
            Math.PI *
            (size - thickness)
          }
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
    </Box>
  );
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  progress,
  minutes,
  seconds,
  running,
  isUrgent,
  isFinished,
  onStart,
  onPause,
  onReset,
  onChangeTime,
}) => {
  const theme = useTheme();
  const buttonState = isFinished
    ? { text: '完了', disabled: true, action: () => {} }
    : running
      ? { text: '一時停止', disabled: false, action: onPause }
      : { text: 'スタート', disabled: false, action: onStart };

  return (
    <>
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 4 }}>
        <OptimizedCircularProgress
          progress={progress}
          size={360}
          thickness={4}
          isUrgent={isUrgent}
          isFinished={isFinished}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
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
            }}
          >
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.secondary' }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={buttonState.action}
          startIcon={running ? <PauseIcon /> : <PlayArrowIcon />}
          size="large"
          disabled={buttonState.disabled}
          sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}
        >
          {buttonState.text}
        </Button>
        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<RestartAltIcon />}
          size="large"
          sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, fontSize: '1.1rem' }}
        >
          リセット
        </Button>
        <Button
          variant="text"
          onClick={onChangeTime}
          startIcon={<AccessTimeIcon />}
          size="large"
          sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, fontSize: '1.1rem' }}
        >
          時間変更
        </Button>
      </Box>
    </>
  );
};

export default TimerDisplay;
