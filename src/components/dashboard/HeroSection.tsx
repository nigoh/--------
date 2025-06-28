import React, { useMemo } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  AutoAwesome as AutoAwesomeIcon,
  MeetingRoom as MeetingIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';
import { FadeIn } from '../ui/Animation/MotionComponents';

/**
 * Hero Section Component - Material Design 3 スタイル
 * ダッシュボードのメインビジュアルとブランドメッセージを表示
 * 統一されたテーマシステムとパフォーマンス最適化
 */
export const HeroSection: React.FC = () => {
  const { isDarkMode, isHighContrast, fontSize } = useThemeContext();
  const theme = useTheme();

  // 機能ハイライトデータをメモ化
  const features = useMemo(() => [
    {
      icon: <AutoAwesomeIcon />,
      label: 'AI-powered チーム分け',
      color: theme.palette.primary.main,
    },
    {
      icon: <MeetingIcon />,
      label: 'ミーティング進行',
      color: theme.palette.secondary.main,
    },
    {
      icon: <TrendingUpIcon />,
      label: 'リアルタイム分析',
      color: theme.palette.success.main,
    },
    {
      icon: <SpeedIcon />,
      label: '高速パフォーマンス',
      color: theme.palette.warning.main,
    },
  ], [theme]);

  // 背景スタイルをメモ化
  const backgroundStyles = useMemo(() => ({
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    py: { xs: theme.spacing(3), md: theme.spacing(4) },
    position: 'relative',
    overflow: 'hidden',
    minHeight: '35vh',
    display: 'flex',
    alignItems: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 20% 20%, ${alpha(theme.palette.common.white, 0.1)} 0%, transparent 50%),
                   radial-gradient(circle at 80% 80%, ${alpha(theme.palette.common.white, 0.05)} 0%, transparent 50%),
                   url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      zIndex: 0,
    },
  }), [theme]);

  // チップスタイルをメモ化
  const getChipStyles = useMemo(() => (featureColor: string) => ({
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    color: theme.palette.primary.contrastText,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
    fontWeight: 500,
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${alpha(featureColor, 0.3)}`,
    },
    '& .MuiChip-icon': {
      color: featureColor,
    },
  }), [theme]);
  
  return (
    <Box sx={backgroundStyles}>
      <Container maxWidth="lg">
        <FadeIn>
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 700,
                marginBottom: theme.spacing(0.5),
                background: `linear-gradient(45deg, ${theme.palette.common.white} 30%, ${alpha(theme.palette.common.white, 0.8)} 90%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.1)}`,
              }}
            >
              WorkApp
            </Typography>
            
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                marginBottom: theme.spacing(2.5),
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: '600px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              チーム分けからミーティング進行、勤怠管理まで<br />
              一つのプラットフォームで効率的にワークフローを管理
            </Typography>
            
            {/* Feature highlights */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: theme.spacing(1), 
                marginBottom: theme.spacing(1),
                '& > *': {
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0,
                },
                '& > *:nth-of-type(1)': { animationDelay: '0.1s' },
                '& > *:nth-of-type(2)': { animationDelay: '0.2s' },
                '& > *:nth-of-type(3)': { animationDelay: '0.3s' },
                '& > *:nth-of-type(4)': { animationDelay: '0.4s' },
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              {features.map((feature, index) => (
                <Chip
                  key={index}
                  icon={feature.icon}
                  label={feature.label}
                  size="small"
                  sx={getChipStyles(feature.color)}
                />
              ))}
            </Box>
          </Box>
        </FadeIn>
      </Container>
    </Box>
  );
};

export default HeroSection;
