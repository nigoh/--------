import React from 'react';
import { 
  Box, 
  Button,
  useTheme,
  Divider
} from '@mui/material';
import { 
  Shuffle as ShuffleIcon, 
  People as PeopleIcon,
  MeetingRoom as MeetingIcon, 
  AccessTime as TimeIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ExpenseIcon
} from '@mui/icons-material';
import { SlideUp, StaggerContainer } from '../ui/Animation/MotionComponents';
import { SectionContainer, GridContainer } from '../layout/MainLayout';
import { CustomCard, CustomCardContent } from '../ui/Card';
import { SectionTitle, BodyText, CardTitle, Caption } from '../ui/Typography';
import { buttonStyles } from '../../theme/componentStyles';

/**
 * Feature Cards Component - M3 Expressive Style
 * アプリの主要機能をカード形式で表示し、各機能への導線を提供
 */

interface FeatureCardsProps {
  onNavigate: (tab: number) => void;
  onShowMeeting: () => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ 
  onNavigate, 
  onShowMeeting 
}) => {
  const theme = useTheme();
  
  const features = [
    {
      icon: <ShuffleIcon />,
      title: 'チーム分け',
      description: 'AIを活用したスマートなチーム編成で、バランスの取れたグループを自動生成',
      color: theme.palette.primary.main,
      tabIndex: 0,
    },
    {
      icon: <MeetingIcon />,
      title: 'ミーティング',
      description: '効率的なミーティング進行をサポート。タイマー機能付きの5ステップワークフロー',
      color: theme.palette.success.main,
      tabIndex: 3,
    },
    {
      icon: <PeopleIcon />,
      title: '社員管理',
      description: 'スキルベースの社員情報管理と検索機能で、適切な人材配置をサポート',
      color: theme.palette.secondary.main,
      tabIndex: 1,
    },
    {
      icon: <TimeIcon />,
      title: '勤怠管理',
      description: '直感的な勤怠記録と分析機能で、働き方の見える化を実現',
      color: theme.palette.info.main,
      tabIndex: 2,
    },
    {
      icon: <ExpenseIcon />,
      title: '経費管理',
      description: '経費の登録・承認・分析を効率化し、透明性のある経費管理を実現',
      color: theme.palette.warning.main,
      tabIndex: 4,
    },
    {
      icon: <InventoryIcon />,
      title: '備品管理',
      description: '備品の在庫管理・貸出管理を効率化し、リソースの最適化を実現',
      color: theme.palette.error.main,
      tabIndex: 5,
    },
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.title === 'ミーティング') {
      onShowMeeting();
    } else {
      onNavigate(feature.tabIndex);
    }
  };

  return (
    <SectionContainer maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <StaggerContainer>
        <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />
        <GridContainer 
          autoFit={true}
          minItemWidth="220px"
          gap={2}
          sx={{ 
            maxHeight: { md: '420px' },
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }
          }}
        >
          {features.map((feature, index) => (
            <SlideUp key={index}>
              <CustomCard
                interactive
                hoverEffect="lift"
                variant="elevated"
                surfaceLevel={1}
                onClick={() => handleFeatureClick(feature)}
                sx={{
                  height: '100%',
                  borderRadius: 0.5,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    opacity: 0.8,
                  },
                }}
              >
                <CustomCardContent 
                  padding="md" 
                  flex 
                  flexDirection="column" 
                  fullHeight
                >
                  <Box sx={{ 
                    mb: 1.5, 
                    color: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: `${feature.color}15`,
                    mx: 'auto',
                  }}>
                    {React.cloneElement(feature.icon, { sx: { fontSize: 24 } })}
                  </Box>
                  <CardTitle sx={{ 
                    mb: 1, 
                    textAlign: 'center',
                    color: theme.palette.text.primary,
                    fontSize: '1rem',
                  }}>
                    {feature.title}
                  </CardTitle>
                  <Caption sx={{ 
                    opacity: 0.7, 
                    lineHeight: 1.5, 
                    flex: 1, 
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                  }}>
                    {feature.description}
                  </Caption>
                </CustomCardContent>
              </CustomCard>
            </SlideUp>
          ))}
        </GridContainer>
      </StaggerContainer>
    </SectionContainer>
  );
};

export default FeatureCards;
