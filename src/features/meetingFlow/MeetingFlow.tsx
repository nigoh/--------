/**
 * ミーティングフローメインコンポーネント（リファクタリング後）
 * 
 * 責務分離により、レイアウト・データ読み込み・UI描画を分離し、
 * よりシンプルで保守しやすい構造に変更
 */
import React from 'react';
import { useTheme } from '@mui/material';
import StepPanel from './StepPanel';
import TipsSidePanel from './TipsSidePanel';
import steps, { tips, Step as StepType } from './meetingFlowData';
import { useMeetingFlowStore } from './useMeetingFlowStore';
import { useTipsContentLoader } from './hooks/useTipsContentLoader';
import { MeetingFlowLayout, MeetingFlowContent } from './components/MeetingFlowLayout';

interface MeetingFlowProps {
  onBack: (updatedTeams?: string[][]) => void;
  teams: string[][];
  setTeams: (teams: string[][]) => void;
  members: string[];
}

export default function MeetingFlow({ onBack, teams, setTeams, members }: MeetingFlowProps) {
  const theme = useTheme();
  
  // Zustandストアから状態とアクションを取得
  const {
    activeStep,
    stepTimes,
    timerRunning,
    showAlert,
    sidebarOpen,
    startTimer,
    pauseTimer,
    finishTimer,
    closeAlert,
    setStepTime,
    setSidebarOpen,
    toggleSidebar,
    nextStep,
    prevStep,
  } = useMeetingFlowStore();
  
  // Tipsコンテンツを読み込み
  const { stepTipsContent } = useTipsContentLoader();
  
  // step情報にteams・timeを上書きし、他プロパティも展開
  const step: StepType = {
    ...steps[activeStep],
    time: stepTimes[activeStep],
    teams: teams,
  };

  // チーム分け画面に戻る時に最新のteamsをAppに戻す
  const handleReturnToShuffle = () => {
    onBack(teams);
  };
  
  // 時間変更ハンドラー
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(1, Math.min(120, Number(e.target.value)));
    setStepTime(activeStep, v);
  };

  // サイドバーコンテンツ
  const sidebarContent = (
    <TipsSidePanel 
      markdownContent={stepTipsContent[activeStep] || ''} 
      tips={stepTipsContent[activeStep] ? undefined : tips} 
    />
  );

  return (
    <MeetingFlowLayout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={toggleSidebar}
      onCloseSidebar={() => setSidebarOpen(false)}
      sidebarContent={sidebarContent}
    >
      {/* ステップ進行部 */}
      <MeetingFlowContent>
        <StepPanel
          step={step}
          stepsLength={steps.length}
          activeStep={activeStep}
          timerRunning={timerRunning}
          showAlert={showAlert}
          onTimeChange={handleTimeChange}
          onTimerFinish={finishTimer}
          onStart={startTimer}
          onPause={pauseTimer}
          onBack={prevStep}
          onNext={nextStep}
          onReturnToShuffle={handleReturnToShuffle}
          onAlertClose={closeAlert}
          theme={theme}
        />
      </MeetingFlowContent>
    </MeetingFlowLayout>
  );
}
