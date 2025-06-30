import React from 'react';
import { Box, Button, Chip, Stack, Typography, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { spacingTokens } from '../../../theme/designSystem';
import GroupIcon from '@mui/icons-material/Group';
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
          <Stack direction="row" spacing={spacingTokens.sm}>
            <Chip
              icon={<GroupIcon />}
              label={`登録社員 (${count}人)`}
              variant="outlined"
              color="primary"
              size="medium"
              sx={{ px: 1 }}
            />
            <Button
              variant="text"
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
