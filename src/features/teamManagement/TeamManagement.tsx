import React from 'react';
import { Box, Container } from '@mui/material';
import { EnhancedTeamList } from './EnhancedTeamList';

/**
 * チーム管理のメインページコンポーネント
 */
const TeamManagement: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <EnhancedTeamList />
      </Box>
    </Container>
  );
};

export default TeamManagement;