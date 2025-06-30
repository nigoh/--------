import React from 'react';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SaveIcon from '@mui/icons-material/Save';
import { spacingTokens } from '../../../theme/designSystem';

interface TeamListHeaderProps {
  count: number;
  onCreateTeam: () => void;
  onSaveCurrentTeams: () => void;
  hasCurrentTeams: boolean;
}

export const TeamListHeader: React.FC<TeamListHeaderProps> = ({
  count,
  onCreateTeam,
  onSaveCurrentTeams,
  hasCurrentTeams,
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'space-between', lg: 'flex-end' },
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: spacingTokens.sm,
        }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems={{ xs: 'stretch', sm: 'center' }} 
          spacing={spacingTokens.sm}
          sx={{ width: { xs: '100%', lg: 'auto' } }}
        >
          <Typography
            variant="body2"
            sx={{ 
              color: theme.palette.text.secondary,
              textAlign: { xs: 'center', lg: 'right' },
              whiteSpace: 'nowrap'
            }}
          >
            保存済みチーム ({count}個)
          </Typography>
          
          <Stack direction="row" spacing={spacingTokens.sm}>
            <Button
              variant="contained"
              startIcon={<GroupAddIcon />}
              onClick={onCreateTeam}
              size="small"
              sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                textTransform: 'none',
              }}
            >
              チーム新規作成
            </Button>
            
            {hasCurrentTeams && (
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={onSaveCurrentTeams}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                現在のチーム分けを保存
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default TeamListHeader;