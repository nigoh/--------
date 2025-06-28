import { Paper, Typography, Box, Chip, Stack, Grow, useTheme } from '@mui/material';
import React from 'react';
import { getMemberColorByName } from './utils';

interface TeamCardProps {
  team: string[];
  teamIndex: number;
  animate: boolean;
  allMembers?: string[]; // 全メンバーリストを追加
}

const TeamCard = ({ team, teamIndex, animate, allMembers = [] }: TeamCardProps) => {
  const theme = useTheme();

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
        {/* セカンダリカラー25% - カード背景 */}
        <Paper 
          variant="outlined" 
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 3,
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.grey[800] 
              : theme.palette.grey[50],
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[4],
            minWidth: 240,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.01)',
              boxShadow: theme.shadows[8],
              borderColor: theme.palette.primary.main,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          {/* チーム名ヘッダー */}
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 2, 
              letterSpacing: 1,
              color: theme.palette.text.primary,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box 
              sx={{ 
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.primary.contrastText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              {teamIndex + 1}
            </Box>
            チーム{teamIndex + 1}
          </Typography>
          
          {/* 区切り線 */}
          <Box sx={{ 
            width: '60%', 
            height: '2px', 
            background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}80, transparent)`,
            borderRadius: 1,
            mb: 3 
          }} />
          
          {/* メンバー表示エリア - メインカラー70% */}
          <Box sx={{
            width: '100%',
            p: 2,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            minHeight: 100,
          }}>
            <Stack 
              direction="row" 
              spacing={1} 
              flexWrap="wrap" 
              justifyContent="center" 
              sx={{ 
                width: '100%', 
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
                      fontSize: '0.875rem',
                      bgcolor: color,
                      color: '#ffffff',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      boxShadow: `0 2px 8px ${color}40`,
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                      transition: `all 0.2s ease-in-out ${i * 0.08}s`,
                      '&:hover': {
                        transform: 'translateY(-2px) scale(1.03)',
                        boxShadow: `0 4px 12px ${color}60`,
                      },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* メンバー数表示 */}
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2,
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            メンバー {team.length}名
          </Typography>
        </Paper>
      </Box>
    </Grow>
  );
};

export default TeamCard;
