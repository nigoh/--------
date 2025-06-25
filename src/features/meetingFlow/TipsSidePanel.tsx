import { Paper, keyframes } from '@mui/material';
import TipsPanel from '../../components/TipsPanel';
import React from 'react';

// アニメーション定義
const slideInRight = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(30px); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const glowBorder = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(118, 75, 162, 0.08); }
  50% { box-shadow: 0 8px 40px rgba(118, 75, 162, 0.15); }
`;

interface TipsSidePanelProps {
  markdownContent?: string;
  tips?: string[];
}

const TipsSidePanel: React.FC<TipsSidePanelProps> = ({ markdownContent, tips }) => (
  <Paper elevation={2} sx={{
    p: { xs: 2, sm: 3 },
    width: '100%',
    height: '100%',
    borderRadius: 3,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(118, 75, 162, 0.2)',
    boxShadow: '0 8px 32px rgba(118, 75, 162, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    minHeight: { xs: 120, md: '100%' },
    overflowY: 'auto',
    boxSizing: 'border-box',
    animation: `${slideInRight} 0.6s ease-out, ${glowBorder} 4s ease-in-out infinite`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.01)',
      boxShadow: '0 12px 40px rgba(118, 75, 162, 0.15)',
      background: 'rgba(255, 255, 255, 1)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
      borderRadius: '3px 3px 0 0',
    },
  }}>
    <TipsPanel markdownContent={markdownContent} tips={tips} />
  </Paper>
);

export default TipsSidePanel;
