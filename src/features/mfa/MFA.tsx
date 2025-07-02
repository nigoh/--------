/**
 * 多要素認証（MFA）管理画面
 */
import React from 'react';
import { 
  FeatureLayout, 
  FeatureHeader, 
  FeatureContent 
} from '../../components/layout';
import { MFAManager } from './components/MFAManager';
import { spacingTokens } from '../../theme/designSystem';
import { Box } from '@mui/material';

/**
 * 多要素認証（MFA）管理ページコンポーネント
 */
const MFA: React.FC = () => {
  return (
    <FeatureLayout maxWidth="xl">
      <FeatureHeader
        title="多要素認証（MFA）"
        subtitle="アカウントのセキュリティを強化するための追加認証設定"
        showAddButton={false}
      />
      <FeatureContent variant="transparent" padding={spacingTokens.lg}>
        <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
          <MFAManager />
        </Box>
      </FeatureContent>
    </FeatureLayout>
  );
};

export default MFA;
