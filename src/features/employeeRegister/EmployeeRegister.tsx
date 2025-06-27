/**
 * 社員登録メインページコンポーネント
 * 
 * 社員登録フォームと社員一覧をタブで切り替えて表示する
 * Material Design 3 準拠のモダンデザイン
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
  useTheme,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { EmployeeRegisterForm } from './EmployeeRegisterForm';
import { EmployeeList } from './EmployeeList';
import { useEmployeeStore } from './useEmployeeStore';
import { 
  FadeIn, 
  SlideUp, 
  StaggerContainer, 
  StaggerItem,
  PageTransition 
} from '../../components/ui/Animation/MotionComponents';
import { 
  surfaceStyles, 
  buttonStyles 
} from '../../theme/componentStyles';
import { spacingTokens, shapeTokens } from '../../theme/designSystem';
import { BentoGrid, createBentoItem, createWideBentoItem } from '../../components/ui/Bento/BentoGrid';

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
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  /**
   * タブ変更ハンドラー
   */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // アクティブな社員数を計算
  const activeEmployeeCount = employees.filter(emp => emp.isActive).length;

  // ダッシュボード用のBentoアイテムを作成
  const bentoItems = [
    createWideBentoItem(
      'header',
      <Box sx={{ textAlign: 'center', py: spacingTokens.lg }}>
        <Typography 
          variant="h3" 
          sx={{ 
            mb: spacingTokens.md,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
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
      </Box>,
      { minHeight: 200 }
    ),
    createBentoItem(
      'stats-total',
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
          {employees.length}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          総社員数
        </Typography>
      </Box>,
      { 
        backgroundColor: theme.palette.primary.light + '20',
        interactive: true,
        minHeight: 150,
      }
    ),
    createBentoItem(
      'stats-active',
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
          {activeEmployeeCount}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          アクティブ
        </Typography>
      </Box>,
      { 
        backgroundColor: theme.palette.success.light + '20',
        interactive: true,
        minHeight: 150,
      }
    ),
    createBentoItem(
      'stats-inactive',
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
          {employees.length - activeEmployeeCount}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          非アクティブ
        </Typography>
      </Box>,
      { 
        backgroundColor: theme.palette.warning.light + '20',
        interactive: true,
        minHeight: 150,
      }
    ),
  ];

  return (
    <Container maxWidth="lg" sx={{ py: spacingTokens.xl }}>
      <StaggerContainer>
        {/* ダッシュボード */}
        <StaggerItem>
          <BentoGrid 
            items={bentoItems}
            columns={{
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 4,
            }}
            gap={spacingTokens.lg}
            animated={true}
            sx={{ mb: spacingTokens.xxl }}
          />
        </StaggerItem>

        {/* タブナビゲーション */}
        <StaggerItem>
          <Paper 
            sx={{ 
              ...surfaceStyles.elevated(3)(theme),
              borderRadius: shapeTokens.corner.extraLarge,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
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
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  height: 4,
                  borderRadius: '2px 2px 0 0',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minHeight: 80,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 90%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transform: 'scale(1.05)',
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateY(-2px)',
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
                  <Badge 
                    badgeContent={activeEmployeeCount} 
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }
                    }}
                  >
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
              <PageTransition mode="fade" key="employee-form">
                <EmployeeRegisterForm />
              </PageTransition>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <PageTransition mode="fade" key="employee-list">
                <EmployeeList />
              </PageTransition>
            </TabPanel>
          </Paper>
        </StaggerItem>

        {/* フッター */}
        <StaggerItem>
          <FadeIn>
            <Box sx={{ mt: spacingTokens.xxxxl, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  padding: spacingTokens.md,
                  borderRadius: shapeTokens.corner.large,
                  backgroundColor: theme.palette.action.hover,
                }}
              >
                © 2025 社員管理システム - チーム分けツールと連携
              </Typography>
            </Box>
          </FadeIn>
        </StaggerItem>
      </StaggerContainer>
    </Container>
  );
};
