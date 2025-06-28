import React from 'react';
import { Container, Stack, Box, Typography, useTheme } from '@mui/material';
import { TimecardForm } from './TimecardForm';
import { TimecardList } from './TimecardList';
import { 
  FadeIn, 
  SlideUp, 
  StaggerContainer, 
  StaggerItem 
} from '../../components/ui/Animation/MotionComponents';
import { surfaceStyles } from '../../theme/componentStyles';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';

const Timecard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
    }}>
      {/* ヘッダー */}
      <FadeIn>
        <Box sx={{ 
          py: spacingTokens.lg,
          px: spacingTokens.md,
          ...surfaceStyles.glassmorphism(theme),
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            タイムカード管理
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ textAlign: 'center', mt: spacingTokens.xs }}
          >
            勤怠記録と管理
          </Typography>
        </Box>
      </FadeIn>

      {/* スクロール可能なコンテンツエリア */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        position: 'relative',
      }}>
        <Container maxWidth="sm" sx={{ py: spacingTokens.xl, height: '100%' }}>
          <StaggerContainer>
            <Stack spacing={spacingTokens.xl}>
              <StaggerItem>
                <SlideUp>
                  <TimecardForm />
                </SlideUp>
              </StaggerItem>
              
              <StaggerItem>
                <SlideUp>
                  <TimecardList />
                </SlideUp>
              </StaggerItem>
            </Stack>
          </StaggerContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default Timecard;
