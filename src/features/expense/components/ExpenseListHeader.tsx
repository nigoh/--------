/**
 * 経費一覧のヘッダーコンポーネント
 * 
 * タイトル、件数表示、アクションボタンを含む
 */
import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Toolbar,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { surfaceStyles } from '../../../theme/componentStyles';
import { spacingTokens } from '../../../theme/designSystem';

interface ExpenseListHeaderProps {
  count: number;
  onAdd: () => void;
  onExport: () => void;
  disableExport?: boolean;
}

export const ExpenseListHeader: React.FC<ExpenseListHeaderProps> = ({
  count,
  onAdd,
  onExport,
  disableExport = false,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        ...surfaceStyles.surface(theme),
        mb: spacingTokens.md,
        flexShrink: 0,
      }}
    >
      <Toolbar sx={{ py: spacingTokens.sm }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          経費一覧 ({count}件)
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={onExport}
            size="small"
            disabled={disableExport}
          >
            CSV出力
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            size="small"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            }}
          >
            新規登録
          </Button>
        </Stack>
      </Toolbar>
    </Paper>
  );
};
