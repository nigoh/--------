import React from 'react';
import { Box } from '@mui/material';
import { PageTransition } from '../ui/Animation/MotionComponents';
import { HeroSection } from './HeroSection';
import { FeatureCards } from './FeatureCards';

/**
 * Dashboard Component
 * ダッシュボード全体を管理するコンポーネント
 * HeroSectionとFeatureCardsを組み合わせて表示
 */

interface DashboardProps {
  onNavigate: (tab: number) => void;
  onShowMeeting: () => void;
  currentTheme: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigate, 
  onShowMeeting, 
  currentTheme 
}) => {
  return (
    <PageTransition mode="fade" key="hero">
      <Box sx={{ 
        height: '100%', 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: currentTheme.palette.primary.main,
          borderRadius: '4px',
        },
      }}>
        <HeroSection />
        <FeatureCards 
          onNavigate={onNavigate} 
          onShowMeeting={onShowMeeting}
        />
      </Box>
    </PageTransition>
  );
};

export default Dashboard;
