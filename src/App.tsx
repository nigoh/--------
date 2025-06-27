
import React, { useState, Suspense } from 'react';
import { ThemeProvider, CssBaseline, Box, Tabs, Tab, Container } from '@mui/material';
import { 
  Shuffle as ShuffleIcon, 
  People as PeopleIcon,
  MeetingRoom as MeetingIcon, AccessTime as TimeIcon 
} from '@mui/icons-material';
import { createModernTheme } from './theme/modernTheme';
import { CustomThemeProvider, useThemeContext } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import EnterpriseSettingsPanel from './components/EnterpriseSettingsPanel';
import { PageLoader } from './components/LoadingSpinner';
import { NotificationSystem } from './components/NotificationSystem';
import { ProgressOverlay } from './components/ProgressOverlay';
import { PageTransition, FadeIn } from './components/ui/Animation/MotionComponents';
import { surfaceStyles } from './theme/componentStyles';
import { initPerformanceMonitoring, PerformanceDevTools } from './utils/performance';

// Lazy load components for better performance
const TeamShuffle = React.lazy(() => import('./features/teamShuffle/TeamShuffle'));
const MeetingFlow = React.lazy(() => import('./features/meetingFlow/MeetingFlow'));
const EmployeeRegister = React.lazy(() => import('./features/employeeRegister/EmployeeRegister').then(module => ({ default: module.EmployeeRegister })));
const Timecard = React.lazy(() => import("./features/timecard/Timecard"));

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
      id={`main-tabpanel-${index}`}
      aria-labelledby={`main-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

/**
 * タブのa11y属性を生成
 */
const a11yProps = (index: number) => {
  return {
    id: `main-tab-${index}`,
    'aria-controls': `main-tabpanel-${index}`,
  };
};

// テーマプロバイダーでラップされたメインアプリ
function AppContent() {
  const [showMeeting, setShowMeeting] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  
  const { isDarkMode, isHighContrast, fontSize } = useThemeContext();
  const currentTheme = createModernTheme({ 
    mode: isDarkMode ? 'dark' : 'light', 
    highContrast: isHighContrast, 
    fontSize 
  });

  // パフォーマンス監視を初期化
  React.useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  /**
   * タブ変更ハンドラー
   */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // ミーティングフロー表示中は別画面
  if (showMeeting) {
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <ErrorBoundary>
          <EnterpriseSettingsPanel />
          <PageTransition mode="slide">
            <Suspense fallback={<PageLoader message="ミーティングフローを読み込み中..." />}>
              <MeetingFlow
                onBack={(updatedTeams?: string[][]) => {
                  if (updatedTeams) setTeams(updatedTeams);
                  setShowMeeting(false);
                }}
                teams={teams}
                setTeams={setTeams}
                members={members}
              />
            </Suspense>
          </PageTransition>
        </ErrorBoundary>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <EnterpriseSettingsPanel />
        
        {/* メインナビゲーション */}
        <Container maxWidth={false} disableGutters>
          <FadeIn>
            <Box 
              sx={{ 
                ...surfaceStyles.glassmorphism(currentTheme),
                borderBottom: 1, 
                borderColor: 'divider',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <Container maxWidth="lg">
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  centered
                  sx={{
                    '& .MuiTabs-indicator': {
                      background: `linear-gradient(45deg, ${currentTheme.palette.primary.main} 30%, ${currentTheme.palette.secondary.main} 90%)`,
                      height: 3,
                      borderRadius: '2px 2px 0 0',
                    },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '1rem',
                      minHeight: 64,
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        background: `linear-gradient(45deg, ${currentTheme.palette.primary.main} 10%, ${currentTheme.palette.secondary.main} 90%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        transform: 'scale(1.05)',
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: currentTheme.palette.action.hover,
                      },
                    },
                  }}
                >
                  <Tab
                    icon={<ShuffleIcon />}
                    label="チーム分け"
                    {...a11yProps(0)}
                  />
                  <Tab
                    icon={<PeopleIcon />}
                    label="社員管理"
                    {...a11yProps(1)}
                  />
                  <Tab
                    icon={<TimeIcon />}
                    label="勤怠管理"
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Container>
            </Box>
          </FadeIn>

          {/* タブコンテンツ */}
          <TabPanel value={currentTab} index={0}>
            <PageTransition mode="fade" key="team-shuffle">
              <Suspense fallback={<PageLoader message="チームシャッフルを読み込み中..." />}>
                <TeamShuffle
                  onShowMeeting={() => setShowMeeting(true)}
                  members={members}
                  setMembers={setMembers}
                  teams={teams}
                  setTeams={setTeams}
                />
              </Suspense>
            </PageTransition>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <PageTransition mode="fade" key="employee-register">
              <Suspense fallback={<PageLoader message="社員管理を読み込み中..." />}>
                <EmployeeRegister />
              </Suspense>
            </PageTransition>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <PageTransition mode="fade" key="timecard">
              <Suspense fallback={<PageLoader message="勤怠管理を読み込み中..." />}>
                <Timecard />
              </Suspense>
            </PageTransition>
          </TabPanel>
        </Container>

        {/* グローバル通知システム */}
        <NotificationSystem />
        <ProgressOverlay />
        
        {/* 開発環境でのパフォーマンス監視ツール */}
        <PerformanceDevTools />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

// 名簿・チーム状態をAppで管理
function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
