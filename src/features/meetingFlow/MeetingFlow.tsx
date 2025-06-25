import { Box, Button, Paper, Divider, Alert, Stack, MobileStepper, useTheme, IconButton, Typography, Grid, Drawer, useMediaQuery } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StepPanel from './StepPanel';
import TipsSidePanel from './TipsSidePanel';
import AnimatedBackground from '../../components/AnimatedBackground';
import { useState, useEffect } from 'react';
import steps, { tips, Step as StepType } from './meetingFlowData';
import { loadStepTips } from './tipsLoader';
import { useResponsive } from '../../hooks/useResponsive';
import { focusStyles } from '../../utils/accessibility';

interface MeetingFlowProps {
  onBack: (updatedTeams?: string[][]) => void;
  teams: string[][];
  setTeams: (teams: string[][]) => void;
  members: string[];
}

export default function MeetingFlow({ onBack, teams, setTeams, members }: MeetingFlowProps) {
  const theme = useTheme();
  const { isMobile, isTablet, spacing, cardPadding } = useResponsive();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [stepTimes, setStepTimes] = useState<number[]>(steps.map(s => s.time));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stepTipsContent, setStepTipsContent] = useState<string[]>([]);
  
  // ステップのMarkdownコンテンツを読み込み
  useEffect(() => {
    const loadTips = async () => {
      const tipsContent: string[] = [];
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.tipsMarkdownFile) {
          try {
            const response = await fetch(`/src/features/meetingFlow/tips/${step.tipsMarkdownFile}`);
            if (response.ok) {
              const content = await response.text();
              tipsContent[i] = content;
            } else {
              tipsContent[i] = `# Step ${i + 1} のコツ\n\nコツの情報を読み込み中にエラーが発生しました。`;
            }
          } catch (error) {
            console.error(`Error loading tips for step ${i + 1}:`, error);
            tipsContent[i] = `# Step ${i + 1} のコツ\n\nコツの情報を読み込み中にエラーが発生しました。`;
          }
        } else {
          tipsContent[i] = '';
        }
      }
      setStepTipsContent(tipsContent);
    };

    loadTips();
  }, []);
  
  // step情報にteams・timeを上書きし、他プロパティ（imageUrl等）も展開
  const step: StepType = {
    ...steps[activeStep],
    time: stepTimes[activeStep],
    teams: teams,
  };

  const handleNext = () => {
    setTimerRunning(false);
    setShowAlert(false);
    setTimeout(() => {
      setActiveStep(s => Math.min(s + 1, steps.length - 1));
      setTimerRunning(false);
    }, 200);
  };
  const handleBack = () => {
    setTimerRunning(false);
    setShowAlert(false);
    setTimeout(() => {
      setActiveStep(s => Math.max(s - 1, 0));
      setTimerRunning(false);
    }, 200);
  };

  // チーム分け画面に戻る時に最新のteamsをAppに戻す
  const handleReturnToShuffle = () => {
    onBack(teams);
  };
  const handleTimerFinish = () => {
    setShowAlert(true);
  };
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(1, Math.min(120, Number(e.target.value)));
    setStepTimes(times => {
      const newTimes = [...times];
      newTimes[activeStep] = v;
      return newTimes;
    });
  };

  return (
    <AnimatedBackground>
      <Box sx={{ 
        minHeight: '100svh', 
        p: { xs: 1, sm: 2 }, 
        width: '100vw', 
        height: '100svh', 
        boxSizing: 'border-box', 
        overflow: 'auto' 
      }}>
        {/* モバイル用ハンバーガーメニュー */}
        {isMobile && (
          <Box sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 1300,
          }}>
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.05)',
                },
                ...focusStyles,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        <Box 
          sx={{ 
            height: '100%', 
            width: '100%', 
            maxWidth: '100vw', 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: spacing,
            boxSizing: 'border-box' 
          }} 
        >
          {/* ステップ進行部（左カラム） */}
          <Box sx={{ 
            boxSizing: 'border-box',
            flex: { xs: '1 1 auto', md: '1 1 58%' },
            height: { xs: 'auto', md: '100%' },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <StepPanel
              step={step}
              stepsLength={steps.length}
              activeStep={activeStep}
              timerRunning={timerRunning}
              showAlert={showAlert}
              onTimeChange={handleTimeChange}
              onTimerFinish={handleTimerFinish}
              onStart={() => setTimerRunning(true)}
              onPause={() => setTimerRunning(false)}
              onBack={handleBack}
              onNext={handleNext}
              onReturnToShuffle={handleReturnToShuffle}
              theme={theme}
            />
          </Box>
          
          {/* Tipsパネル部 - デスクトップは右カラム、モバイルはDrawer */}
          {isMobile ? (
            <Drawer
              anchor="right"
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              sx={{
                '& .MuiDrawer-paper': {
                  width: '85vw',
                  maxWidth: 400,
                  backgroundColor: 'transparent',
                  backgroundImage: 'none',
                },
              }}
            >
              <Box sx={{ 
                height: '100%',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2 
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    進行のコツ
                  </Typography>
                  <IconButton 
                    onClick={() => setSidebarOpen(false)}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      },
                      ...focusStyles,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TipsSidePanel 
                    markdownContent={stepTipsContent[activeStep] || ''} 
                    tips={stepTipsContent[activeStep] ? undefined : tips} 
                  />
                </Box>
              </Box>
            </Drawer>
          ) : (
            <Box sx={{ 
              boxSizing: 'border-box',
              flex: { xs: '1 1 auto', md: '1 1 42%' },
              height: { xs: 'auto', md: '100%' },
              display: 'flex',
              flexDirection: 'column'
            }}>
              <TipsSidePanel 
                markdownContent={stepTipsContent[activeStep] || ''} 
                tips={stepTipsContent[activeStep] ? undefined : tips} 
              />
            </Box>
          )}
        </Box>
      </Box>
    </AnimatedBackground>
  );
}
