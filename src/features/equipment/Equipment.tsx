import React from 'react';
import { FeatureLayout } from '../../components/layout';
import { EquipmentRegister } from './EquipmentRegister';

const Equipment: React.FC = () => {
  return (
    <FeatureLayout maxWidth={false}>
      <EquipmentRegister />
    </FeatureLayout>
  );
};

export default Equipment;
