import React, { useRef, useState, useCallback, useMemo, memo } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert, InputAdornment, Container, Fab, AppBar, Toolbar, CssBaseline, Stack, Grid } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import GroupIcon from '@mui/icons-material/Group';
import MemberRegister from './MemberRegister';
import ConfettiCanvas, { ConfettiCanvasHandle } from '../../components/ConfettiCanvas';
import TeamResultPanel from './TeamResultPanel';
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
  const { isMobile, spacing, containerMaxWidth, cardPadding, buttonSize } = useResponsive();
  const [teamCount, setTeamCount] = useState(2);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [animate, setAnimate] = useState(false);
  // ...既存のロジックでmembers, setMembers, teams, setTeamsをprops経由で利用...
  return (
    <AnimatedBackground>
      <CssBaseline />
      {/* アニメーションレイヤーを最背面に配置 */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ConfettiCanvas ref={confettiRef} />
      </Box>
      <AppBar position="fixed" sx={{ width: '100vw', left: 0, top: 0 }}>
        <Toolbar>
          <GroupIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ランダムチーム分けアプリ
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={containerMaxWidth as any} sx={{ pt: 10 }}>
        <Paper 
          sx={{ 
            p: cardPadding, 
            mb: spacing,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
          }} 
        >
          <MemberRegister
            members={members}
            onAddMember={async (name: string) => setMembers([...members, name])}
            onRemoveMember={async (idx: number) => setMembers(members.filter((_, i) => i !== idx))}
            onEditMember={async (idx: number, newName: string) => setMembers(members.map((m, i) => (i === idx ? newName : m)))}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={spacing} 
              alignItems="center" 
              justifyContent="center"
              sx={{ mb: 2 }}
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
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  },
                }}
              />
              
              <Button
                variant="contained"
                color="primary"
                size={buttonSize as any}
                sx={{ 
                  height: isMobile ? 48 : 56, 
                  minWidth: isMobile ? 120 : 160, 
                  width: { xs: '100%', sm: 'auto' },
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 20px rgba(103, 126, 234, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  ...focusStyles,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 8px 30px rgba(103, 126, 234, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(0) scale(0.98)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                    transform: 'none',
                    boxShadow: 'none',
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
                    
                    // コンフェッティ発射（confettiは自動で停止する）
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
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Box>
          <TeamResultPanel
            teams={teams}
            animate={animate}
            showResult={showResult}
            onShowMeeting={onShowMeeting}
            allMembers={members}
          />
        </Paper>
      </Container>
    </AnimatedBackground>
  );
}

export default memo(TeamShuffle);
