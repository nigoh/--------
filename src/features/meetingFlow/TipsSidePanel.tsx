import { Paper, useTheme } from '@mui/material';
import TipsPanel from '../../components/TipsPanel';
import React from 'react';

interface TipsSidePanelProps {
  markdownContent?: string;
  tips?: string[];
}

const TipsSidePanel: React.FC<TipsSidePanelProps> = ({ markdownContent, tips }) => {
  const theme = useTheme();
  
  return (
    <Paper elevation={2} sx={{
      p: { xs: 2, sm: 3 },
      width: '100%',
      height: '100%',
      borderRadius: 3,
      backgroundColor: theme.palette.background.paper, // メインカラー70%
      border: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      minHeight: { xs: 120, md: '100%' },
      overflowY: 'auto',
      boxSizing: 'border-box',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8],
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, // アクセントカラー5%
        borderRadius: '3px 3px 0 0',
      },
    }}>
      <TipsPanel markdownContent={markdownContent} tips={tips} />
    </Paper>
  );
};

export default TipsSidePanel;
