import React from 'react';
import { Container, Stack } from '@mui/material';
import { TimecardForm } from './TimecardForm';
import { TimecardList } from './TimecardList';

const Timecard: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <TimecardForm />
        <TimecardList />
      </Stack>
    </Container>
  );
};

export default Timecard;
