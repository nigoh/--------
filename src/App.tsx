import { useState, useEffect, useRef, RefObject } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert, InputAdornment, Container, CssBaseline, AppBar, Toolbar, Fade, Grow, Fab } from '@mui/material';
import Grid from '@mui/material/Grid';
import StopIcon from '@mui/icons-material/Stop';
import GroupIcon from '@mui/icons-material/Group';
import { set, get } from 'idb-keyval';
import MeetingFlow from './MeetingFlow';
// @ts-ignore
// 型定義がないためidb-keyvalのany利用を許容

// 紙吹雪＋花火アニメーション
// 紙吹雪＋花火アニメーション（継続型）
let confettiAnim: number | null = null;
function launchConfetti(canvasRef: RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = (canvas.width = window.innerWidth);
  const H = (canvas.height = window.innerHeight);
  // 紙吹雪
  const confettiCount = 180;
  const confetti = Array.from({ length: confettiCount }, () => ({
    x: Math.random() * W,
    y: Math.random() * H - H,
    r: Math.random() * 6 + 4,
    d: Math.random() * confettiCount,
    color: `hsl(${Math.random() * 360},90%,60%)`,
    tilt: Math.random() * 10 - 10
  }));
  // 花火
  const fireworks: { particles: { x: number; y: number; vx: number; vy: number; alpha: number; color: string }[] }[] = [];
  function spawnFirework() {
    const x = Math.random() * W * 0.8 + W * 0.1;
    const y = Math.random() * H * 0.3 + H * 0.1;
    const color = `hsl(${Math.random() * 360},90%,60%)`;
    const particles = Array.from({ length: 32 }, (_, i) => {
      const angle = (Math.PI * 2) * (i / 32);
      const speed = Math.random() * 3 + 2;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color
      };
    });
    fireworks.push({ particles });
  }
  let angle = 0;
  let tiltAngle = 0;
  let frame = 0;
  let stop = false;
  function draw() {
    if (!ctx) return;
    if (stop) {
      ctx.clearRect(0, 0, W, H);
      return;
    }
    ctx.clearRect(0, 0, W, H);
    // 紙吹雪
    confetti.forEach((c, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
      ctx.stroke();
      ctx.restore();
    });
    // 花火
    fireworks.forEach(fw => {
      fw.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      });
    });
    update();
    frame++;
    if (frame % 40 === 0) spawnFirework();
    confettiAnim = requestAnimationFrame(draw);
  }
  function update() {
    angle += 0.01;
    tiltAngle += 0.1;
    confetti.forEach((c, i) => {
      c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) * 0.8;
      c.x += Math.sin(angle);
      c.tilt = Math.sin(tiltAngle - i / 3) * 15;
      if (c.y > H) {
        c.x = Math.random() * W;
        c.y = -10;
      }
    });
    // 花火
    fireworks.forEach(fw => {
      fw.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= 0.012;
      });
    });
    // 花火の消滅
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].particles = fireworks[i].particles.filter(p => p.alpha > 0);
      if (fireworks[i].particles.length === 0) fireworks.splice(i, 1);
    }
  }
  draw();
  // 停止関数を返す
  return () => {
    stop = true;
    if (confettiAnim) cancelAnimationFrame(confettiAnim);
    if (ctx) ctx.clearRect(0, 0, W, H);
  };
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createTeams(members: string[], teamCount: number): string[][] {
  const shuffled = shuffle(members);
  const teams: string[][] = Array.from({ length: teamCount }, () => []);
  shuffled.forEach((member, idx) => {
    teams[idx % teamCount].push(member);
  });
  return teams;
}

const MEMBER_KEY = 'memberText';
const TEAM_KEY = 'teams';
const TEAM_COUNT_KEY = 'teamCount';

function App() {
  const [memberText, setMemberText] = useState<string>('');
  const [teamCount, setTeamCount] = useState<number>(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);
  const [showMeeting, setShowMeeting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiStopper = useRef<(() => void) | null>(null);

  // IndexedDBからデータ復元
  useEffect(() => {
    (async () => {
      const savedMembers = await get(MEMBER_KEY);
      const savedTeams = await get(TEAM_KEY);
      const savedTeamCount = await get(TEAM_COUNT_KEY);
      if (savedMembers) setMemberText(savedMembers);
      if (savedTeams) setTeams(savedTeams);
      if (savedTeamCount) setTeamCount(savedTeamCount);
    })();
  }, []);

  // 入力内容を保存
  useEffect(() => {
    set(MEMBER_KEY, memberText);
  }, [memberText]);
  useEffect(() => {
    set(TEAM_COUNT_KEY, teamCount);
  }, [teamCount]);
  useEffect(() => {
    set(TEAM_KEY, teams);
  }, [teams]);

  const handleCreateTeams = () => {
    if (confettiStopper.current) confettiStopper.current();
    const members = memberText
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
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
      setTeams(createTeams(members, teamCount));
      setShowResult(true);
      setAnimate(true);
      setTimeout(() => {
        const stopper = launchConfetti(canvasRef as RefObject<HTMLCanvasElement>);
        confettiStopper.current = stopper ? stopper : null;
      }, 300);
    }, 200);
  };

  const handleClear = () => {
    if (confettiStopper.current) confettiStopper.current();
    setMemberText('');
    setTeams([]);
    setError('');
    setShowResult(false);
    setAnimate(false);
  };

  if (showMeeting) {
    return <MeetingFlow onBack={() => setShowMeeting(false)} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f5fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <CssBaseline />
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 1000 }} />
      {/* アニメーション停止ボタン */}
      <Fab color="secondary" aria-label="stop" size="medium" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }} onClick={() => { if (confettiStopper.current) confettiStopper.current(); }}>
        <StopIcon />
      </Fab>
      <AppBar position="fixed" sx={{ width: '100vw', left: 0, top: 0 }}>
        <Toolbar>
          <GroupIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ランダムチーム分けアプリ
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 10, pb: 4 }}>
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 480, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom align="center">名簿入力</Typography>
            <TextField
              label="名簿（1行1名）"
              multiline
              minRows={6}
              maxRows={12}
              fullWidth
              value={memberText}
              onChange={e => setMemberText(e.target.value)}
              placeholder={"例:\n田中太郎\n山田花子\n..."}
              margin="normal"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="チーム数"
              type="number"
              inputProps={{ min: 1, max: 20 }}
              value={teamCount}
              onChange={e => setTeamCount(Number(e.target.value))}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">個</InputAdornment>,
              }}
              sx={{ width: 160, mb: 2 }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleCreateTeams}>
                チーム分け
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleClear}>
                クリア
              </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Paper>
          <Box sx={{ width: '100%', maxWidth: 600, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {showResult && (
              <Fade in={animate} timeout={800}>
                <Paper elevation={4} sx={{ p: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fffde7', boxShadow: '0 0 32px #ffe082' }}>
                  <Typography variant="h4" gutterBottom align="center" color="primary.main" sx={{ fontWeight: 'bold', mb: 3 }}>チーム分け結果</Typography>
                  <Grid container spacing={3} justifyContent="center" alignItems="center">
                    {teams.map((team, idx) => (
                      <Grow in={animate} style={{ transformOrigin: '0 0 0' }} timeout={600 + idx * 200} key={idx}>
                        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: '#fffbe7', boxShadow: '0 0 24px #ffe082', minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom align="center" color="primary" sx={{ mb: 2 }}>
                              チーム{idx + 1}
                            </Typography>
                            <ul style={{ paddingLeft: 0, margin: 0, textAlign: 'center', listStyle: 'none', fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.04em' }}>
                              {team.map((member, i) => (
                                <li key={i} style={{ margin: '0.5em 0' }}>{member}</li>
                              ))}
                            </ul>
                          </Paper>
                        </Grid>
                      </Grow>
                    ))}
                  </Grid>
                  {/* 進行アプリへ遷移ボタン */}
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button variant="contained" color="success" size="large" onClick={() => setShowMeeting(true)}>
                      ミーティング進行アプリへ
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
