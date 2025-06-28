/**
 * 社員登録フォームコンポーネント（リファクタリング後）
 * 
 * 責務分離により、UIとロジックを分離し、
 * 再利用可能なカスタムフックとUIコンポーネントに構成
 */
import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import { EmployeeRegisterFormUI } from './components/EmployeeRegisterFormUI';

/**
 * 社員登録フォームコンテナコンポーネント
 */
export const EmployeeRegisterForm: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 1 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ mb: 1.5, textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#1976d2', fontSize: '1.1rem' }}>社員登録</h3>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.8rem' }}>
            新しい社員の情報を入力してください
          </p>
        </Box>
        
        <EmployeeRegisterFormUI />
      </Paper>
    </Container>
  );
};
