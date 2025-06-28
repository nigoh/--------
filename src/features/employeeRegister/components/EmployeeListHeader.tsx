import React from 'react';
import { Box, Typography, Button, Stack, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { surfaceStyles } from '../../../theme/componentStyles';
import { spacingTokens } from '../../../theme/designSystem';

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
    <Box sx={{ ...surfaceStyles.elevated(1)(theme), p: spacingTokens.md, mb: spacingTokens.md }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: spacingTokens.sm,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}30%, ${theme.palette.secondary.main} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          社員一覧 ({count}人)
        </Typography>
        <Stack direction="row" spacing={spacingTokens.sm}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExport}
            size="small"
            disabled={disableExport}
          >
            CSV出力
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={onAdd}
            size="small"
            sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)` }}
          >
            社員登録
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default EmployeeListHeader;
