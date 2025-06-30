import React, { useRef, useState, useCallback, useMemo, memo } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert, InputAdornment, Container, Fab, AppBar, Toolbar, CssBaseline, Stack, Grid, useTheme, Tabs, Tab } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import GroupIcon from '@mui/icons-material/Group';
import SaveIcon from '@mui/icons-material/Save';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import MemberRegister from './MemberRegister';
import ConfettiCanvas, { ConfettiCanvasHandle } from '../../components/ConfettiCanvas';
import TeamResultPanel from './TeamResultPanel';
import TeamManagement from './TeamManagement';
import AnimatedBackground from '../../components/AnimatedBackground';
import { createTeams } from './utils';
import { useResponsive } from '../../hooks/useResponsive';
import { focusStyles } from '../../utils/accessibility';

interface TeamShuffleProps {
  onShowMeeting: () => void;
  members: string[];
  setMembers: (v: string[]) => void;
  teams: string[][];
  setTeams: (v: string[][]) => void;
}

const TeamShuffle = ({ onShowMeeting, members, setMembers, teams, setTeams }: TeamShuffleProps) => {
  const confettiRef = useRef<ConfettiCanvasHandle>(null);
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const [teamCount, setTeamCount] = useState(2);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0: ランダム生成, 1: チーム管理

  /**
   * チーム管理から読み込まれたチームを適用
   */
  const handleLoadTeam = (loadedTeams: string[][]) => {
    setTeams(loadedTeams);
    setShowResult(true);
    setAnimate(true);
    setCurrentTab(0); // ランダム生成タブに切り替え
  };

  /**
   * 現在のチーム分け結果を保存
   */
  const handleSaveCurrentTeams = () => {
    // TeamManagement コンポーネント内で処理
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      // メインカラー70% - 背景
      backgroundColor: theme.palette.background.default,
    }}>
      <CssBaseline />
      
      {/* アニメーションレイヤー */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ConfettiCanvas ref={confettiRef} />
        <AnimatedBackground>
          <Box />
        </AnimatedBackground>
      </Box>

      {/* ヘッダー - セカンダリカラー25% */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[900] 
            : theme.palette.grey[100],
          color: theme.palette.text.primary,
          boxShadow: `0 1px 3px ${theme.palette.divider}`,
          zIndex: 1100,
          flexShrink: 0,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* アクセントカラー5% - アイコン */}
          <GroupIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 28 }} />
          <Typography 
            variant={isMobile ? "h6" : "h5"}
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            チーム管理
          </Typography>
        </Toolbar>
      </AppBar>

      {/* メインコンテンツエリア - スクロール可能 */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        position: 'relative',
        zIndex: 1,
        // メインカラー70%
        backgroundColor: theme.palette.background.default,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.divider,
          borderRadius: '4px',
        },
      }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>
          {/* タブナビゲーション */}
          <Paper 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[800] 
                : theme.palette.grey[50],
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <Tab 
                icon={<ShuffleIcon />} 
                label="ランダム生成" 
                iconPosition="start"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  color: currentTab === 0 ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              />
              <Tab 
                icon={<SaveIcon />} 
                label="チーム管理" 
                iconPosition="start"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  color: currentTab === 1 ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              />
            </Tabs>
          </Paper>

          {/* タブコンテンツ */}
          {currentTab === 0 && (
            <>
              {/* メイン操作パネル - セカンダリカラー25% */}
              <Paper 
                sx={{ 
                  p: { xs: 2, sm: 3, md: 4 },
                  mb: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? theme.palette.grey[800] 
                    : theme.palette.grey[50],
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  // アクセントカラー5% - トップボーダー
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
                {/* メンバー登録セクション */}
                <MemberRegister
                  members={members}
                  onAddMember={async (name: string) => setMembers([...members, name])}
                  onRemoveMember={async (idx: number) => setMembers(members.filter((_, i) => i !== idx))}
                  onEditMember={async (idx: number, newName: string) => setMembers(members.map((m, i) => (i === idx ? newName : m)))}
                />

                {/* チーム分け操作セクション */}
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2}
                    alignItems="center" 
                    justifyContent="center"
                    sx={{ mb: 3 }}
                  >
                    <TextField
                      label="チーム数"
                      type="number"
                      inputProps={{ min: 1, max: members.length || 1 }}
                      value={teamCount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamCount(Number(e.target.value))}
                      size="medium"
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">個</InputAdornment>,
                        }
                      }}
                      sx={{ 
                        width: { xs: '100%', sm: 200 },
                        // メインカラー70% - 入力フィールド
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                    
                    {/* アクセントカラー5% - メインアクションボタン */}
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ 
                        height: 56, 
                        minWidth: { xs: '100%', sm: 160 },
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        color: theme.palette.primary.contrastText,
                        textTransform: 'none',
                        boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                          transition: 'left 0.6s ease',
                        },
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 16px ${theme.palette.primary.main}50`,
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                        '&:disabled': {
                          background: theme.palette.action.disabledBackground,
                          transform: 'none',
                        },
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => {
                        if (members.length < teamCount || teamCount < 1) {
                          setError('人数がチーム数より少ないか、チーム数が1未満です');
                          setTeams([]);
                          setShowResult(false);
                          return;
                        }
                        
                        setError('');
                        setShowResult(false);
                        setAnimate(false);
                        
                        setTimeout(() => {
                          const newTeams = createTeams(members, teamCount);
                          setTeams(newTeams);
                          setShowResult(true);
                          setAnimate(true);
                          
                          setTimeout(() => {
                            confettiRef.current?.launch();
                          }, 400);
                        }, 200);
                      }}
                      disabled={members.length < 2}
                    >
                      🎲 チーム分け実行
                    </Button>
                  </Stack>
                  
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        borderRadius: 2,
                        backgroundColor: theme.palette.error.light + '20',
                        border: `1px solid ${theme.palette.error.main}40`,
                        color: theme.palette.error.main,
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                </Box>
              </Paper>

              {/* 結果表示エリア */}
              <TeamResultPanel
                teams={teams}
                animate={animate}
                showResult={showResult}
                onShowMeeting={onShowMeeting}
                allMembers={members}
              />
            </>
          )}

          {/* チーム管理タブ */}
          {currentTab === 1 && (
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? theme.palette.grey[800] 
                  : theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
                // アクセントカラー5% - トップボーダー
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
              <TeamManagement
                currentMembers={members}
                currentTeams={teams}
                onLoadTeam={handleLoadTeam}
                onSaveCurrentTeams={handleSaveCurrentTeams}
              />
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default memo(TeamShuffle);
