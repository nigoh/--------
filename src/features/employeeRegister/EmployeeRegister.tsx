/**
 * 社員管理メインページコンポーネント
 * 
 * 社員一覧を中心とした設計
 * 新規登録・編集はモーダルで実装
 * Material Design 3 準拠のコンパクトなデザイン
 */
import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { EnhancedEmployeeList } from './EnhancedEmployeeList';
import { 
  FadeIn, 
  StaggerContainer, 
  StaggerItem,
} from '../../components/ui/Animation/MotionComponents';
import { spacingTokens } from '../../theme/designSystem';

/**
 * 社員管理メインページコンポーネント
 */
export const EmployeeRegister: React.FC = () => {
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
          <StaggerContainer>
            {/* コンパクトなヘッダー */}
            <StaggerItem>
              <FadeIn>
                <Box sx={{ mb: spacingTokens.md, textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: spacingTokens.xs,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 600,
                      fontSize: { xs: '1.75rem', sm: '2rem' }
                    }}
                  >
                    社員管理
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ maxWidth: 500, mx: 'auto' }}
                  >
                    社員情報の管理・検索・統計をワンストップで
                  </Typography>
                </Box>
              </FadeIn>
            </StaggerItem>

            {/* 拡張社員一覧 */}
            <StaggerItem>
              <FadeIn>
                <Box sx={{ height: 'calc(100vh - 160px)' }}>
                  <EnhancedEmployeeList />
                </Box>
              </FadeIn>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </Box>
    </Box>
  );
};
