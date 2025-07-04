import React, { useState, Suspense } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  useMediaQuery
} from '@mui/material';
import { createModernTheme } from './theme/modernTheme';
import { CustomThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './auth';
import { LogProvider } from './logging';
import ErrorBoundary from './components/ErrorBoundary';
import EnterpriseSettingsPanel from './components/EnterpriseSettingsPanel';
import { PageLoader } from './components/LoadingSpinner';
import { NotificationSystem } from './components/NotificationSystem';
import { ProgressOverlay } from './components/ProgressOverlay';
import { PageTransition } from './components/ui/Animation/MotionComponents';
import { initPerformanceMonitoring, PerformanceDevTools } from './utils/performance';

// 開発環境でのAdmin作成ツールを読み込み
if (import.meta.env.DEV) {
  import('./utils/adminDevTools');
}

// 分離されたコンポーネントのインポート
import { Dashboard } from './components/dashboard';
import { AppHeader, ScrollableContent } from './components/layout';
import { FloatingNavigation, MobileNavDrawer, SideNavigation } from './components/navigation';
import { TabPanel } from './components/common';

// Lazy load components for better performance
const TeamManagement = React.lazy(() => import('./features/teamManagement/TeamManagement'));
const MeetingFlow = React.lazy(() => import('./features/meetingFlow/MeetingFlow'));
const UserManagement = React.lazy(() => import('./features/userManagement').then(module => ({ default: module.UserManagement })));
const Timecard = React.lazy(() => import("./features/timecard/Timecard"));
const Expense = React.lazy(() => import('./features/expense/Expense'));
const Equipment = React.lazy(() => import('./features/equipment/Equipment'));
const DialogShowcase = React.lazy(() => import('./components/DialogShowcase'));
const AuthPage = React.lazy(() => import('./features/authentication').then(module => ({ default: module.AuthPage })));
const MFAManagement = React.lazy(() => import('./features/mfa/MFA'));
const UserProfile = React.lazy(() => import('./features/userProfile/UserProfile'));
const Passkey = React.lazy(() => import('./features/passkey/Passkey'));
const LoggingDemo = React.lazy(() => import('./components/LoggingDemo').then(module => ({ default: module.LoggingDemo })));
const LoggingDashboard = React.lazy(() => import('./components/dashboard/LoggingDashboard'));
const AdminUserCreator = React.lazy(() => import('./features/adminManagement').then(module => ({ default: module.AdminUserCreator })));

// メインアプリコンテンツ
function AppContent() {
  const [members, setMembers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);
  const [currentTab, setCurrentTab] = useState(-1); // -1 = Hero/Dashboard view
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  
  const { isDarkMode, isHighContrast, fontSize, mode } = useThemeContext();
  const { isAuthenticated, isLoading } = useAuth();
  const currentTheme = createModernTheme({ 
    mode: mode === 'system' ? (isDarkMode ? 'dark' : 'light') : mode, 
    highContrast: isHighContrast, 
    fontSize 
  });
  
  const isMobile = useMediaQuery(currentTheme.breakpoints.down('md'));

  // 環境変数でAdminUserCreator機能の有効/無効を制御
  const isAdminCreatorEnabled = import.meta.env.VITE_ENABLE_ADMIN_CREATOR === 'true' && import.meta.env.DEV;
  const adminCreatorTabIndex = parseInt(import.meta.env.VITE_ADMIN_CREATOR_TAB || '99', 10);

  // パフォーマンス監視を初期化
  React.useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  // 認証中の場合
  if (isLoading) {
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Box sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <PageLoader message="認証状態を確認中..." />
        </Box>
      </ThemeProvider>
    );
  }

  // 未認証の場合は認証画面を表示
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Suspense fallback={<PageLoader message="認証画面を読み込み中..." />}>
          <AuthPage />
        </Suspense>
      </ThemeProvider>
    );
  }

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
          
          {/* 背景アニメーション（テスト用） */}
          {/* <GeometricAnimatedBackground /> */}
          
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
                <PageTransition mode="fade" key="user-management">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="ユーザー管理を読み込み中..." />}>
                      <UserManagement />
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

              <TabPanel value={currentTab} index={6}>
                <PageTransition mode="fade" key="dialog-demo">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="ダイアログデモを読み込み中..." />}>
                      <DialogShowcase />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={7}>
                <PageTransition mode="fade" key="mfa-management">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="MFA管理ページを読み込み中..." />}>
                      <MFAManagement />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={8}>
                <PageTransition mode="fade" key="user-profile">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="ユーザー設定を読み込み中..." />}>
                      <UserProfile />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={9}>
                <PageTransition mode="fade" key="passkey-management">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="パスキー管理を読み込み中..." />}>
                      <Passkey />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={10}>
                <PageTransition mode="fade" key="logging-dashboard">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="ロギングダッシュボードを読み込み中..." />}>
                      <LoggingDashboard />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              <TabPanel value={currentTab} index={11}>
                <PageTransition mode="fade" key="logging-demo">
                  <ScrollableContent>
                    <Suspense fallback={<PageLoader message="ログ機能デモを読み込み中..." />}>
                      <LoggingDemo />
                    </Suspense>
                  </ScrollableContent>
                </PageTransition>
              </TabPanel>

              {/* 管理者作成ツール - 環境変数で制御 */}
              {isAdminCreatorEnabled && (
                <TabPanel value={currentTab} index={adminCreatorTabIndex}>
                  <PageTransition mode="fade" key="admin-creator">
                    <ScrollableContent>
                      <Suspense fallback={<PageLoader message="管理者作成ツールを読み込み中..." />}>
                        <AdminUserCreator />
                      </Suspense>
                    </ScrollableContent>
                  </PageTransition>
                </TabPanel>
              )}
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
      <LogProvider 
        endpoint="/api/logs"
        enableHttpTransport={import.meta.env.PROD}
        enableStorageTransport={true}
        config={{
          enabledInProduction: true,
          maxBufferSize: 1000,
          flushInterval: 30000,
        }}
      >
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LogProvider>
    </CustomThemeProvider>
  );
}

export default App;
