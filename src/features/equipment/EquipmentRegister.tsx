import React from 'react';
import {
  Box,
  Container,
  Divider,
  useTheme,
} from '@mui/material';
import { EnhancedEquipmentList } from './EnhancedEquipmentList';
import { PageTitle } from '../../components/ui/Typography';
import { spacingTokens } from '../../theme/designSystem';

/**
 * 備品管理メインページコンポーネント
 */
export const EquipmentRegister: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* スクロール可能なコンテンツエリア */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        py: spacingTokens.sm,
      }}>
        <Container maxWidth="xl" sx={{ height: '100%', py: 0 }}>
          {/* コンパクトなヘッダー */}
          <Box sx={{ mb: spacingTokens.md, textAlign: 'center' }}>
            <PageTitle 
              sx={{ 
                mb: spacingTokens.xs,
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: { xs: '1.75rem', sm: '2rem' }
              }}
            >
              備品管理
            </PageTitle>
            <Divider sx={{ my: spacingTokens.sm }} />
          </Box>

          {/* 拡張備品一覧 */}
          <Box sx={{ height: 'calc(100vh - 160px)' }}>
            <EnhancedEquipmentList />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
