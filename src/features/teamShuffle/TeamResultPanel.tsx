
import React from 'react';
import { Paper, Typography, Box, Fade, Button, useTheme } from '@mui/material';
import { Celebration as CelebrationIcon } from '@mui/icons-material';
import TeamCard from './TeamCard';
import ConfettiCanvas, { ConfettiCanvasHandle } from '../../components/ConfettiCanvas';
import { useRef, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
    const theme = useTheme();
    const confettiRef = useRef<ConfettiCanvasHandle>(null);

    useEffect(() => {
        if (showResult && animate) {
            confettiRef.current?.launch();
        }
    }, [showResult, animate]);

    return (
        <Box sx={{ 
            width: '100%', 
            maxWidth: 900, 
            mx: 'auto', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 4, 
            position: 'relative' 
        }}>
            {/* 紙吹雪・花火エフェクト */}
            <ConfettiCanvas ref={confettiRef} />
            {showResult && (
                <Fade in={animate} timeout={800}>
                    {/* メインカラー70% - 背景 */}
                    <Paper elevation={6} sx={{
                        p: { xs: 2, sm: 5 },
                        width: '100%',
                        maxWidth: 900,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 4,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[12],
                        },
                    }}>
                        {/* タイトル */}
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            align="center" 
                            sx={{ 
                                fontWeight: 700, 
                                mb: 4, 
                                letterSpacing: 1,
                                color: theme.palette.text.primary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Box 
                                sx={{ 
                                    width: 6, 
                                    height: 32, 
                                    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    borderRadius: 3
                                }} 
                            />
                            <CelebrationIcon sx={{ color: theme.palette.primary.main }} />
                            チーム分け結果
                            <CelebrationIcon sx={{ color: theme.palette.secondary.main }} />
                        </Typography>
                        
                        {/* チーム表示エリア - セカンダリカラー25% */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 4, 
                            justifyContent: 'center', 
                            alignItems: 'stretch', 
                            width: '100%',
                            p: 2,
                            backgroundColor: theme.palette.mode === 'dark' 
                                ? theme.palette.grey[900] 
                                : theme.palette.grey[50],
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                        }}>
                            {teams.map((team, idx) => (
                                <TeamCard 
                                    key={idx} 
                                    team={team} 
                                    teamIndex={idx} 
                                    animate={animate} 
                                    allMembers={allMembers} 
                                />
                            ))}
                        </Box>
                        
                        {/* 進行アプリへ遷移ボタン - アクセントカラー5% */}
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
                                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                                    color: theme.palette.success.contrastText,
                                    boxShadow: `0 4px 20px ${theme.palette.success.main}40`,
                                    transition: 'all 0.3s ease-in-out',
                                    textTransform: 'none',
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                                        transform: 'translateY(-3px) scale(1.02)',
                                        boxShadow: `0 8px 30px ${theme.palette.success.main}60`,
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
