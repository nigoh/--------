/**
 * ユーザープロファイル管理機能
 * アカウント情報の表示・編集機能
 */
import React from 'react';
import { Box } from '@mui/material';
import { spacingTokens } from '../../theme/designSystem';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { UserProfileManager } from './components/UserProfileManager';

const UserProfile: React.FC = () => {
  return (
    <FeatureLayout maxWidth="xl">
      <FeatureHeader
        title="プロフィール設定"
        subtitle="アカウント情報の管理と設定"
        showAddButton={false}
      />
      
      <FeatureContent variant="transparent">
        <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
          <UserProfileManager />
        </Box>
      </FeatureContent>
    </FeatureLayout>
  );
};

export default UserProfile;
