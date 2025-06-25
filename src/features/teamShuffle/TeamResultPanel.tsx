
import React from 'react';
import { Paper, Typography, Box, Fade, Button, keyframes } from '@mui/material';
import TeamCard from './TeamCard';
import ConfettiCanvas, { ConfettiCanvasHandle } from '../../components/ConfettiCanvas';
import { useRef, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// アニメーション定義
const titleGlow = keyframes`
  0%, 100% { text-shadow: 0 0 20px rgba(103, 126, 234, 0.5); }
  50% { text-shadow: 0 0 30px rgba(103, 126, 234, 0.8), 0 0 40px rgba(103, 126, 234, 0.3); }
`;

const buttonShine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;


/**
 * チーム分け結果を表示するパネル
 * @param teams チームごとのメンバー配列
 * @param animate アニメーション有無
 * @param showResult 結果表示フラグ
 * @param onShowMeeting ミーティング進行画面への遷移コールバック
 */
interface TeamResultPanelProps {
    teams: string[][];
    animate: boolean;
    showResult: boolean;
    onShowMeeting: () => void;
    allMembers?: string[]; // 全メンバーリストを追加
}


const TeamResultPanel = ({ teams, animate, showResult, onShowMeeting, allMembers = [] }: TeamResultPanelProps) => {
    const confettiRef = useRef<ConfettiCanvasHandle>(null);

    useEffect(() => {
        if (showResult && animate) {
            confettiRef.current?.launch();
        }
    }, [showResult, animate]);

    return (
        <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, position: 'relative' }}>
            {/* 紙吹雪・花火エフェクト */}
            <ConfettiCanvas ref={confettiRef} />
            {showResult && (
                <Fade in={animate} timeout={800}>
                    <Paper elevation={6} sx={{
                        p: { xs: 2, sm: 5 },
                        width: '100%',
                        maxWidth: 900,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 16px 64px rgba(103, 126, 234, 0.15)',
                        borderRadius: 4,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 24px 80px rgba(103, 126, 234, 0.2)',
                        },
                    }}>
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            align="center" 
                            sx={{ 
                                fontWeight: 700, 
                                mb: 4, 
                                letterSpacing: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: `${titleGlow} 3s ease-in-out infinite`,
                            }}
                        >
                            🎉 チーム分け結果 🎉
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 4, 
                          justifyContent: 'center', 
                          alignItems: 'stretch', 
                          width: '100%' 
                        }}>
                            {teams.map((team, idx) => (
                                <TeamCard key={idx} team={team} teamIndex={idx} animate={animate} allMembers={allMembers} />
                            ))}
                        </Box>
                        
                        {/* 進行アプリへ遷移ボタン */}
                        <Box sx={{ mt: 5, textAlign: 'center' }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                endIcon={<ArrowForwardIcon />}
                                onClick={onShowMeeting}
                                sx={{ 
                                    px: 6, 
                                    py: 2, 
                                    fontWeight: 700, 
                                    fontSize: '1.2rem', 
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                    backgroundSize: '200% 100%',
                                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                                    transition: 'all 0.3s ease-in-out',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                                        transform: 'translateY(-3px) scale(1.02)',
                                        boxShadow: '0 8px 30px rgba(76, 175, 80, 0.4)',
                                        animation: `${buttonShine} 1.5s ease-in-out infinite`,
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                            transition: 'left 0.5s ease-in-out',
                                        },
                                    },
                                    '&:hover::before': {
                                        left: '100%',
                                    },
                                }}
                            >
                                ミーティング進行アプリへ
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            )}
        </Box>
    );
};

export default TeamResultPanel;
