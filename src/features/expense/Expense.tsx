import React from 'react';
import { Box } from '@mui/material';
import { ExpenseRegister } from './ExpenseRegister';

const Expense: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <ExpenseRegister />
    </Box>
  );
};

export default Expense;
