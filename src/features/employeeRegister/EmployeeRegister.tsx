/**
 * 社員登録メインページコンポーネント
 * 
 * 社員登録フォームと社員一覧をタブで切り替えて表示する
 */
import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Badge,
  Paper,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { EmployeeRegisterForm } from './EmployeeRegisterForm';
import { EmployeeList } from './EmployeeList';
import { useEmployeeStore } from './useEmployeeStore';

/**
 * タブパネルコンポーネント
 */
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
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

/**
 * タブのa11y属性を生成
 */
const a11yProps = (index: number) => {
  return {
    id: `employee-tab-${index}`,
    'aria-controls': `employee-tabpanel-${index}`,
  };
};

/**
 * 社員登録メインページコンポーネント
 */
export const EmployeeRegister: React.FC = () => {
  const { employees } = useEmployeeStore();
  const [tabValue, setTabValue] = useState(0);

  /**
   * タブ変更ハンドラー
   */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // アクティブな社員数を計算
  const activeEmployeeCount = employees.filter(emp => emp.isActive).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          社員管理システム
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          社員の基本情報、スキル、経験を管理し、効率的なチーム編成を支援します
        </Typography>
      </Box>

      {/* タブナビゲーション */}
      <Paper 
        elevation={2}
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              height: 3,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minHeight: 72,
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #2196F3 10%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
          }}
        >
          <Tab
            icon={<PersonAddIcon />}
            label="社員登録"
            {...a11yProps(0)}
            sx={{ flex: 1 }}
          />
          <Tab
            icon={
              <Badge badgeContent={activeEmployeeCount} color="primary">
                <PeopleIcon />
              </Badge>
            }
            label="社員一覧"
            {...a11yProps(1)}
            sx={{ flex: 1 }}
          />
        </Tabs>

        {/* タブパネル */}
        <TabPanel value={tabValue} index={0}>
          <EmployeeRegisterForm />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <EmployeeList />
        </TabPanel>
      </Paper>

      {/* フッター */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 社員管理システム - チーム分けツールと連携
        </Typography>
      </Box>
    </Container>
  );
};
