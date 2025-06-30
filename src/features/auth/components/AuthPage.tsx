/**
 * AuthPage Component
 * ログイン・登録を切り替える認証メインページ
 */

import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import { Login, PersonAdd } from '@mui/icons-material';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const AuthPage: React.FC = () => {
  const theme = useTheme();
  const { isHighContrast } = useThemeContext();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const switchToRegister = () => setActiveTab(1);
  const switchToLogin = () => setActiveTab(0);

  return (
    <AuthLayout 
      title="Work App"
      subtitle="安全で快適なワークスペースへようこそ"
      maxWidth="sm"
    >
      {/* タブナビゲーション */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="認証タブ"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: isHighContrast ? 0 : '8px 8px 0 0',
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: isHighContrast ? 0 : '3px 3px 0 0',
            },
          }}
        >
          <Tab
            icon={<Login />}
            iconPosition="start"
            label="ログイン"
            id="auth-tab-0"
            aria-controls="auth-tabpanel-0"
          />
          <Tab
            icon={<PersonAdd />}
            iconPosition="start"
            label="新規登録"
            id="auth-tab-1"
            aria-controls="auth-tabpanel-1"
          />
        </Tabs>
      </Box>

      {/* ログインフォーム */}
      <TabPanel value={activeTab} index={0}>
        <LoginForm 
          onSwitchToRegister={switchToRegister}
          onForgotPassword={() => {
            // TODO: パスワードリセットページへの遷移実装
            console.log('Forgot password clicked');
          }}
        />
      </TabPanel>

      {/* 登録フォーム */}
      <TabPanel value={activeTab} index={1}>
        <RegisterForm onSwitchToLogin={switchToLogin} />
      </TabPanel>
    </AuthLayout>
  );
};