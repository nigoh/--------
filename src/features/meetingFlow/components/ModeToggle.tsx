import React from 'react';
import { ToggleButtonGroup, ToggleButton, IconButton, Tooltip, useTheme } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface ModeToggleProps {
  mode: 'timer' | 'picker';
  onModeChange: (_: any, value: 'timer' | 'picker') => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onToggleShortcuts: () => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  mode,
  onModeChange,
  soundEnabled,
  onSoundToggle,
  onToggleShortcuts,
}) => {
  const theme = useTheme();
  return (
    <>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={onModeChange}
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
            },
          },
        }}
      >
        <ToggleButton value="timer">タイマー</ToggleButton>
        <ToggleButton value="picker">時間選択</ToggleButton>
      </ToggleButtonGroup>
      <Tooltip title={soundEnabled ? '音声を無効化' : '音声を有効化'}>
        <IconButton onClick={onSoundToggle} size="small" sx={{ color: soundEnabled ? 'success.main' : 'text.disabled' }}>
          {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="キーボードショートカット">
        <IconButton onClick={onToggleShortcuts} size="small" sx={{ color: 'info.main' }}>
          <KeyboardIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ModeToggle;
