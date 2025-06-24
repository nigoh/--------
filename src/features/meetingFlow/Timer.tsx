import { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';

interface TimerProps {
  seconds: number;
  running: boolean;
  onFinish?: () => void;
  onStart?: () => void;
  onPause?: () => void;
}

export default function Timer({ seconds, running, onFinish, onStart, onPause }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(seconds);
  const intervalRef = useRef<number>();

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

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mb: 2 }}>
      <Box sx={{ fontSize: 32, fontWeight: 'bold', mb: 1 }}>
        {minutes}:{secondsLeft.toString().padStart(2, '0')}
      </Box>
      <Box>
        {running ? (
          <Button variant="outlined" color="secondary" onClick={onPause}>一時停止</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={onStart} disabled={timeLeft === 0}>開始</Button>
        )}
      </Box>
    </Box>
  );
}
