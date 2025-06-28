/**
 * 社員登録メインページコンポーネント
 * 
 * 社員登録フォームと社員一覧をタブで切り替えて表示する
 * Material Design 3 準拠のコンパクトなデザイン
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
  Chip,
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
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
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

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* スクロール可能なコンテンツエリア */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        py: spacingTokens.xs,
      }}>
        <Container maxWidth="lg" sx={{ height: '100%', py: 0 }}>
          <StaggerContainer>
            {/* コンパクトなヘッダー */}
            <StaggerItem>
              <FadeIn>
                <Box sx={{ mb: spacingTokens.sm, textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: spacingTokens.xs,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: { xs: '1.75rem', sm: '2rem' }
                    }}
                  >
                    社員管理
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ maxWidth: 400, mx: 'auto' }}
                  >
                    社員情報とスキル管理
                  </Typography>
                </Box>
              </FadeIn>
            </StaggerItem>

            {/* コンパクトな統計情報 */}
            <StaggerItem>
              <FadeIn>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: spacingTokens.sm 
                }}>
                  <Chip
                    label={`総社員数: ${employees.length}人`}
                    color="primary"
                    variant="filled"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      px: spacingTokens.xs,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      color: theme.palette.primary.contrastText,
                      '& .MuiChip-label': {
                        px: spacingTokens.xs,
                      },
                    }}
                  />
                </Box>
              </FadeIn>
            </StaggerItem>

            {/* タブナビゲーション */}
            <StaggerItem>
              <Paper 
                sx={{ 
                  ...surfaceStyles.elevated(2)(theme),
                  borderRadius: shapeTokens.corner.medium,
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
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
                    minHeight: 48,
                    '& .MuiTabs-indicator': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      height: 2,
                      borderRadius: '1px 1px 0 0',
                    },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      minHeight: 48,
                      py: spacingTokens.xs,
                      transition: 'all 0.2s ease',
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
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
          </StaggerContainer>
        </Container>
      </Box>
    </Box>
  );
};
