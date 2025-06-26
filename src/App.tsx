
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
import SettingsPanel from './components/SettingsPanel';
import { PageLoader } from './components/LoadingSpinner';
import { NotificationSystem } from './components/NotificationSystem';
import { ProgressOverlay } from './components/ProgressOverlay';

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
          <SettingsPanel />
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
        </ErrorBoundary>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <SettingsPanel />
        
        {/* メインナビゲーション */}
        <Container maxWidth={false} disableGutters>
          <Box 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              boxShadow: 1
            }}
          >
            <Container maxWidth="lg">
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    height: 3,
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minHeight: 64,
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

          {/* タブコンテンツ */}
          <TabPanel value={currentTab} index={0}>
            <Suspense fallback={<PageLoader message="チームシャッフルを読み込み中..." />}>
              <TeamShuffle
                onShowMeeting={() => setShowMeeting(true)}
                members={members}
                setMembers={setMembers}
                teams={teams}
                setTeams={setTeams}
              />
            </Suspense>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Suspense fallback={<PageLoader message="社員管理を読み込み中..." />}>
              <EmployeeRegister />
            </Suspense>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Suspense fallback={<PageLoader message="勤怠管理を読み込み中..." />}>
              <Timecard />
            </Suspense>
          </TabPanel>
        </Container>

        {/* グローバル通知システム */}
        <NotificationSystem />
        <ProgressOverlay />
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
