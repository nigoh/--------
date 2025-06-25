import { useEffect, useRef, useState } from 'react';
import { Box, Button, keyframes } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

// アニメーション定義
const timerPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const urgentBlink = keyframes`
  0%, 100% { color: #f44336; text-shadow: 0 0 10px rgba(244, 67, 54, 0.5); }
  50% { color: #ff1744; text-shadow: 0 0 20px rgba(255, 23, 68, 0.8); }
`;

const progressRing = keyframes`
  0% { stroke-dashoffset: 283; }
  100% { stroke-dashoffset: 0; }
`;

interface TimerProps {
  seconds: number;
  running: boolean;
  onFinish?: () => void;
  onStart?: () => void;
  onPause?: () => void;
}

/**
 * シンプルなカウントダウンタイマー
 */
export default function Timer({ seconds, running, onFinish, onStart, onPause }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(seconds);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            onFinish && onFinish();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, onFinish]);

  const minutes = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;
  const progress = ((seconds - timeLeft) / seconds) * 100;
  const isUrgent = timeLeft <= 30 && timeLeft > 0;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      flexDirection: 'column', 
      justifyContent: 'center',  
      mb: 3, 
      gap: 3,
      p: 3,
      borderRadius: 3,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
    }}>
      {/* タイマー表示部 - 円形プログレスバー付き */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* 背景円 */}
        <svg width="280" height="280" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle
            cx="140"
            cy="140"
            r="65"
            fill="transparent"
            stroke="rgba(103, 126, 234, 0.1)"
            strokeWidth="8"
          />
          <circle
            cx="140"
            cy="140"
            r="65"
            fill="transparent"
            stroke={isUrgent ? '#f44336' : '#667eea'}
            strokeWidth="8"
            strokeDasharray="408"
            strokeDashoffset={408 - (408 * progress) / 100}
            style={{
              transition: 'all 0.3s ease-in-out',
              filter: isUrgent ? 'drop-shadow(0 0 8px rgba(244, 67, 54, 0.6))' : 'none'
            }}
          />
        </svg>
        
        {/* タイマー数字 */}
        <Box sx={{ 
          fontSize: { xs: '3.5rem', sm: '4.5rem', md: '5rem' }, 
          fontWeight: 700, 
          textAlign: 'center',
          fontFamily: 'monospace',
          color: isUrgent ? '#f44336' : 'text.primary',
          animation: isUrgent ? `${urgentBlink} 1s ease-in-out infinite` : 
                     running ? `${timerPulse} 2s ease-in-out infinite` : 'none',
          textShadow: isUrgent ? '0 0 10px rgba(244, 67, 54, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1,
        }}>
          {minutes}:{secondsLeft.toString().padStart(2, '0')}
        </Box>
      </Box>

      {/* コントロールボタン */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={running ? onPause : onStart}
          startIcon={running ? <PauseIcon /> : <PlayArrowIcon />}
          size="large"
          disabled={!running && timeLeft === 0}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            background: running 
              ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
              : 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            boxShadow: running
              ? '0 4px 20px rgba(255, 152, 0, 0.3)'
              : '0 4px 20px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: running
                ? '0 6px 24px rgba(255, 152, 0, 0.4)'
                : '0 6px 24px rgba(76, 175, 80, 0.4)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {running ? '一時停止' : 'スタート'}
        </Button>
      </Box>
    </Box>
  );
}
