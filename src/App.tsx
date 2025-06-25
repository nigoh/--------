
import React, { useState, Suspense } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createModernTheme } from './theme/modernTheme';
import { CustomThemeProvider, useThemeContext } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import SettingsPanel from './components/SettingsPanel';
import { PageLoader } from './components/LoadingSpinner';

// Lazy load components for better performance
const TeamShuffle = React.lazy(() => import('./features/teamShuffle/TeamShuffle'));
const MeetingFlow = React.lazy(() => import('./features/meetingFlow/MeetingFlow'));

// テーマプロバイダーでラップされたメインアプリ
function AppContent() {
  const [showMeeting, setShowMeeting] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);
  
  const { isDarkMode, isHighContrast, fontSize } = useThemeContext();
  const currentTheme = createModernTheme({ 
    mode: isDarkMode ? 'dark' : 'light', 
    highContrast: isHighContrast, 
    fontSize 
  });

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
        <Suspense fallback={<PageLoader message="チームシャッフルを読み込み中..." />}>
          <TeamShuffle
            onShowMeeting={() => setShowMeeting(true)}
            members={members}
            setMembers={setMembers}
            teams={teams}
            setTeams={setTeams}
          />
        </Suspense>
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
