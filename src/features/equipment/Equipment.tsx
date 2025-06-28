import React from 'react';
import { Container, Box, useTheme } from '@mui/material';
import { EquipmentForm } from './EquipmentForm';
import { EquipmentList } from './EquipmentList';
import { FadeIn } from '../../components/ui/Animation/MotionComponents';
import { PageTitle } from '../../components/ui/Typography';
import { surfaceStyles } from '../../theme/componentStyles';

const Equipment: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <FadeIn>
        <Box
          sx={{
            py: 3,
            px: 2,
            ...surfaceStyles.glassmorphism(theme),
            borderBottom: `1px solid ${theme.palette.divider}`,
            flexShrink: 0,
          }}
        >
          <PageTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            備品管理
          </PageTitle>
        </Box>
      </FadeIn>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Container maxWidth="md">
          <EquipmentForm />
          <Box sx={{ mt: 3 }}>
            <EquipmentList />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Equipment;
