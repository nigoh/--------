import React from 'react';
import { Box } from '@mui/material';
import { EquipmentRegister } from './EquipmentRegister';

const Equipment: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <EquipmentRegister />
    </Box>
  );
};

export default Equipment;
