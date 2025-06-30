import React from 'react';
import { Box, Typography, Button, useTheme, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { spacingTokens } from '../../theme/designSystem';

interface FeatureHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addButtonText?: string;
  contents?: Array<React.ReactNode>;
  showAddButton?: boolean;
}

/**
 * 機能ページ共通のヘッダーコンポーネント
 * タイトル、説明、アクションボタンを統一されたスタイルで表示
 */
export const FeatureHeader: React.FC<FeatureHeaderProps> = ({
  icon,
  title,
  subtitle,
  contents = [],
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: spacingTokens.md,
        flexWrap: 'wrap',
        gap: spacingTokens.md,
      }}>
        {/* タイトル部分 */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          {/* アイコンがある場合は表示 */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
          }}>

            {icon && icon}
            <Typography
              variant="h5"
              component="h5"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: subtitle ? 1 : 0,
              }}
            >
              {title}
            </Typography>

          </Box>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* コンテンツ部分 */}
        <Box sx={{
          display: 'flex',
          gap: spacingTokens.sm,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {contents.map((content, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              {content}
            </Box>
          ))}
        </Box>
      </Box>

      {/* 区切り線 */}
      <Divider sx={{ mb: spacingTokens.md }} />
    </Box>
  );
};
