import { Paper, Typography, Box, Chip, Stack, Grow, keyframes } from '@mui/material';
import React from 'react';
import { getMemberColorByName } from './utils';

interface TeamCardProps {
  team: string[];
  teamIndex: number;
  animate: boolean;
  allMembers?: string[]; // 全メンバーリストを追加
}

// チップのアニメーション定義（控えめに調整）
const chipSlideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(10px) scale(0.9); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
`;

const cardFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

const chipColors = [
  '#1976d2', '#9c27b0', '#388e3c', '#fbc02d', '#d32f2f', '#0288d1',
  '#7b1fa2', '#388e3c', '#ffa000', '#c2185b', '#0097a7', '#512da8',
  '#689f38', '#f57c00', '#455a64', '#8bc34a', '#f44336', '#00bcd4',
  '#ff9800', '#607d8b', '#e91e63', '#43a047', '#ffb300', '#5d4037',
];


const TeamCard = ({ team, teamIndex, animate, allMembers = [] }: TeamCardProps) => {
  return (
    <Grow in={animate} style={{ transformOrigin: '0 0 0' }} timeout={600 + teamIndex * 200}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'stretch',
          width: { xs: '100%', sm: '50%', md: '33.333%' },
          px: 2,
        }}
      >
        <Paper 
          variant="outlined" 
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(103, 126, 234, 0.2)',
            boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
            minWidth: 240,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.01)',
              boxShadow: '0 12px 36px rgba(103, 126, 234, 0.15)',
              background: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 2, 
              letterSpacing: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            チーム{teamIndex + 1}
          </Typography>
          
          <Box sx={{ 
            width: '60%', 
            height: '2px', 
            background: 'linear-gradient(90deg, transparent, rgba(103, 126, 234, 0.5), transparent)',
            borderRadius: 1,
            mb: 3 
          }} />
          
          <Stack 
            direction="row" 
            spacing={1} 
            flexWrap="wrap" 
            justifyContent="center" 
            sx={{ 
              width: '100%', 
              minHeight: 56,
              gap: 1
            }}
          >
            {team.map((member, i) => {
              // 統一されたカラーパレットを使用
              const color = getMemberColorByName(member, allMembers.length > 0 ? allMembers : team);
              return (
                <Chip
                  key={i}
                  label={member}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    bgcolor: color,
                    color: '#ffffff',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: `0 4px 12px ${color}40`,
                    transform: animate ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                    opacity: animate ? 1 : 0,
                    animation: animate ? `${chipSlideIn} 0.4s ease-out ${i * 0.08}s both` : 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.03)',
                      boxShadow: `0 6px 16px ${color}50`,
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Paper>
      </Box>
    </Grow>
  );
};

export default TeamCard;
