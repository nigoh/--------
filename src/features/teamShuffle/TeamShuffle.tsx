import React, { useRef, useState, useCallback, useMemo, memo } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert, InputAdornment, Container, Fab, AppBar, Toolbar, CssBaseline, Stack, Grid, useTheme } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import GroupIcon from '@mui/icons-material/Group';
import MemberRegister from './MemberRegister';
import ConfettiCanvas, { ConfettiCanvasHandle } from '../../components/ConfettiCanvas';
import TeamResultPanel from './TeamResultPanel';
import AnimatedBackground from '../../components/AnimatedBackground';
import { createTeams } from './utils';
import { useResponsive } from '../../hooks/useResponsive';
import { focusStyles } from '../../utils/accessibility';
import { 
  FadeIn, 
  SlideUp, 
  StaggerContainer, 
  StaggerItem, 
  HoverAnimation 
} from '../../components/ui/Animation/MotionComponents';
import { 
  surfaceStyles, 
  buttonStyles, 
  inputStyles, 
  animations 
} from '../../theme/componentStyles';
import { spacingTokens } from '../../theme/designSystem';

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
  const { isMobile, spacing, containerMaxWidth, cardPadding, buttonSize } = useResponsive();
  const [teamCount, setTeamCount] = useState(2);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [animate, setAnimate] = useState(false);

  return (
    <AnimatedBackground>
      <CssBaseline />
      
      {/* アニメーションレイヤーを最背面に配置 */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ConfettiCanvas ref={confettiRef} />
      </Box>

      {/* ヘッダーをモダンデザインに */}
      <FadeIn>
        <AppBar 
          position="fixed" 
          sx={{ 
            width: '100vw', 
            left: 0, 
            top: 0,
            ...surfaceStyles.glassmorphism(theme),
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <Toolbar>
            <GroupIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ランダムチーム分けアプリ
            </Typography>
          </Toolbar>
        </AppBar>
      </FadeIn>

      <Container maxWidth={containerMaxWidth as any} sx={{ pt: 10 }}>
        <StaggerContainer>
          <StaggerItem>
            <Paper 
              sx={{ 
                ...surfaceStyles.elevated(3)(theme),
                p: spacingTokens.xxl,
                mb: spacingTokens.lg,
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: '24px 24px 0 0',
                },
              }} 
            >
              <StaggerItem>
                <MemberRegister
                  members={members}
                  onAddMember={async (name: string) => setMembers([...members, name])}
                  onRemoveMember={async (idx: number) => setMembers(members.filter((_, i) => i !== idx))}
                  onEditMember={async (idx: number, newName: string) => setMembers(members.map((m, i) => (i === idx ? newName : m)))}
                />
              </StaggerItem>

              <StaggerItem>
                <Box sx={{ mt: spacingTokens.xl, mb: spacingTokens.lg }}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={spacingTokens.md} 
                    alignItems="center" 
                    justifyContent="center"
                    sx={{ mb: spacingTokens.lg }}
                  >
                    <TextField
                      label="チーム数"
                      type="number"
                      inputProps={{ min: 1, max: members.length || 1 }}
                      value={teamCount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamCount(Number(e.target.value))}
                      margin="normal"
                      size={isMobile ? 'medium' : 'small'}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">個</InputAdornment>,
                      }}
                      sx={{ 
                        width: { xs: '100%', sm: 200 },
                        maxWidth: 200,
                        ...inputStyles.outlined(theme),
                      }}
                    />
                    
                    <HoverAnimation hoverScale={1.05} hoverY={-2}>
                      <Button
                        variant="contained"
                        color="primary"
                        size={buttonSize as any}
                        sx={{ 
                          ...buttonStyles.filled(theme),
                          height: isMobile ? 48 : 56, 
                          minWidth: isMobile ? 120 : 160, 
                          width: { xs: '100%', sm: 'auto' },
                          fontSize: isMobile ? '1rem' : '1.1rem',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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
                          '&:hover::before': {
                            left: '100%',
                          },
                          '&:disabled': {
                            background: theme.palette.action.disabledBackground,
                            transform: 'none',
                          },
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
                          
                          // アニメーションとコンフェッティの準備
                          setTimeout(() => {
                            const newTeams = createTeams(members, teamCount);
                            setTeams(newTeams);
                            setShowResult(true);
                            setAnimate(true);
                            
                            // コンフェッティ発射
                            setTimeout(() => {
                              confettiRef.current?.launch();
                            }, 400);
                          }, 200);
                        }}
                        disabled={members.length < 2}
                      >
                        🎲 チーム分け実行
                      </Button>
                    </HoverAnimation>
                  </Stack>
                  
                  {error && (
                    <SlideUp>
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mt: spacingTokens.md,
                          borderRadius: '12px',
                          ...surfaceStyles.elevated(1)(theme),
                        }}
                      >
                        {error}
                      </Alert>
                    </SlideUp>
                  )}
                </Box>
              </StaggerItem>

              <StaggerItem>
                <TeamResultPanel
                  teams={teams}
                  animate={animate}
                  showResult={showResult}
                  onShowMeeting={onShowMeeting}
                  allMembers={members}
                />
              </StaggerItem>
            </Paper>
          </StaggerItem>
        </StaggerContainer>
      </Container>
    </AnimatedBackground>
  );
}

export default memo(TeamShuffle);
