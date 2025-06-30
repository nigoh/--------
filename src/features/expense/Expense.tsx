import React from 'react';
import { FeatureLayout } from '../../components/layout';
import { ExpenseRegister } from './ExpenseRegister';

const Expense: React.FC = () => {
  return (
    <FeatureLayout maxWidth={false}>
      <ExpenseRegister />
    </FeatureLayout>
  );
};

export default Expense;
