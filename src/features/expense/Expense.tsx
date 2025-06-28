import React, { useState } from 'react';
import { Container, Box, Typography, useTheme } from '@mui/material';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { FadeIn } from '../../components/ui/Animation/MotionComponents';
import { surfaceStyles } from '../../theme/componentStyles';

const Expense: React.FC = () => {
  const theme = useTheme();
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  return (
    <Box sx={{
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
    }}>
      <FadeIn>
        <Box sx={{
          py: 3,
          px: 2,
          ...surfaceStyles.glassmorphism(theme),
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            経費管理
          </Typography>
        </Box>
      </FadeIn>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Container maxWidth="md">
          <ExpenseForm />
          <Box sx={{ mt: 3 }}>
            <ExpenseList />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Expense;
