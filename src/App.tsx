import React, { useState, Suspense } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  useMediaQuery
} from '@mui/material';
import { createModernTheme } from './theme/modernTheme';
import { CustomThemeProvider, useThemeContext } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import EnterpriseSettingsPanel from './components/EnterpriseSettingsPanel';
import { PageLoader } from './components/LoadingSpinner';
import { NotificationSystem } from './components/NotificationSystem';
import { ProgressOverlay } from './components/ProgressOverlay';
import { PageTransition } from './components/ui/Animation/MotionComponents';
import { initPerformanceMonitoring, PerformanceDevTools } from './utils/performance';

// 分離されたコンポーネントのインポート
import { Dashboard } from './components/dashboard';
import { AppHeader, ScrollableContent } from './components/layout';
import { FloatingNavigation, MobileNavDrawer, SideNavigation } from './components/navigation';
import { TabPanel } from './components/common';

// Lazy load components for better performance
const TeamManagement = React.lazy(() => import('./features/teamManagement/TeamManagement'));
const MeetingFlow = React.lazy(() => import('./features/meetingFlow/MeetingFlow'));
const EmployeeRegister = React.lazy(() => import('./features/employeeRegister/EmployeeRegister').then(module => ({ default: module.EmployeeRegister })));
const Timecard = React.lazy(() => import("./features/timecard/Timecard"));
const Expense = React.lazy(() => import('./features/expense/Expense'));
const Equipment = React.lazy(() => import('./features/equipment/Equipment'));

// メインアプリコンテンツ
function AppContent() {
  const [members, setMembers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);
  const [currentTab, setCurrentTab] = useState(-1); // -1 = Hero/Dashboard view
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  
  const { isDarkMode, isHighContrast, fontSize } = useThemeContext();
  const currentTheme = createModernTheme({ 
    mode: isDarkMode ? 'dark' : 'light', 
    highContrast: isHighContrast, 
    fontSize 
  });
  
  const isMobile = useMediaQuery(currentTheme.breakpoints.down('md'));

  // パフォーマンス監視を初期化
  React.useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  const handleTabChange = (newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleShowMeeting = () => {
    setCurrentTab(3); // ミーティング進行タブに切り替え
  };
  
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <EnterpriseSettingsPanel 
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
        
        {/* Main Layout Container - 左側メニュー構成 */}
        <Box sx={{ 
          height: '100vh', 
          overflow: 'hidden', 
          display: 'flex',
        }}>
          
          {/* 左側ナビゲーション - デスクトップのみ */}
          {!isMobile && (
            <SideNavigation
              currentTab={currentTab}
              onNavigate={handleTabChange}
              onShowMeeting={handleShowMeeting}
              onOpenSettings={() => setSettingsOpen(true)}
              onOpenPerformance={() => setPerformanceOpen(true)}
              collapsed={sideNavCollapsed}
              onToggleCollapse={() => setSideNavCollapsed(!sideNavCollapsed)}
            />
          )}

          {/* メインコンテンツエリア */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            
            {/* Header - モバイル用のみ表示 */}
            {isMobile && (
              <AppHeader
                currentTheme={currentTheme}
                currentTab={currentTab}
                onTabChange={handleTabChange}
                onBackToDashboard={() => setCurrentTab(-1)}
                onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
                isMobile={isMobile}
              />
            )}

            {/* Main Content Area - スクロール可能 */}
            <Box sx={{ 
              flex: 1, 
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Hero Section - Dashboard View */}
              {currentTab === -1 && (
                <Dashboard
                  onNavigate={handleTabChange}
                  onShowMeeting={handleShowMeeting}
                  currentTheme={currentTheme}
                />
              )}

              {/* Tab Content - スクロール可能 */}
              <TabPanel value={currentTab} index={0}>
                <PageTransition mode="fade" key="team-management">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="チーム管理を読み込み中..." />}>
                      <TeamManagement />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                <PageTransition mode="fade" key="employee-register">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="社員管理を読み込み中..." />}>
                      <EmployeeRegister />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                <PageTransition mode="fade" key="timecard">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="勤怠管理を読み込み中..." />}>
                      <Timecard />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={3}>
                <PageTransition mode="fade" key="meeting-flow">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="ミーティング進行を読み込み中..." />}>
                      <MeetingFlow
                        onBack={(updatedTeams?: string[][]) => {
                          if (updatedTeams) setTeams(updatedTeams);
                          setCurrentTab(-1); // ダッシュボードに戻る
                        }}
                        teams={teams}
                        setTeams={setTeams}
                        members={members}
                      />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={4}>
                <PageTransition mode="fade" key="expense">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="経費管理を読み込み中..." />}>
                      <Expense />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={5}>
                <PageTransition mode="fade" key="equipment">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="備品管理を読み込み中..." />}>
                      <Equipment />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>
            </Box>
          </Box>
        </Box>

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          currentTab={currentTab}
          onNavigate={handleTabChange}
          onShowMeeting={handleShowMeeting}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenPerformance={() => setPerformanceOpen(true)}
        />

        {/* グローバル通知システム */}
        <NotificationSystem />
        <ProgressOverlay />
        
        {/* 開発環境でのパフォーマンス監視ツール */}
        <PerformanceDevTools 
          open={performanceOpen}
          onClose={() => setPerformanceOpen(false)}
        />
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
