import React from 'react';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { surfaceStyles } from '../../../theme/componentStyles';
import { spacingTokens } from '../../../theme/designSystem';
import { SectionTitle } from '../../../components/ui/Typography';

interface EmployeeListHeaderProps {
  count: number;
  onExport: () => void;
  onAdd: () => void;
  disableExport: boolean;
}

export const EmployeeListHeader: React.FC<EmployeeListHeaderProps> = ({
  count,
  onExport,
  onAdd,
  disableExport,
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
            登録社員 ({count}人)
          </Typography>
          
          <Stack direction="row" spacing={spacingTokens.sm}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={onAdd}
              size="small"
              sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)` }}
            >
              社員登録
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onExport}
              size="small"
              disabled={disableExport}
            >
              CSV出力
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default EmployeeListHeader;
