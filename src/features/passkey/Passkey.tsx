/**
 * パスキー管理画面
 */
import React from 'react';
import { 
  FeatureLayout, 
  FeatureHeader, 
  FeatureContent 
} from '../../components/layout';
import { PasskeyManager } from './components/PasskeyManager';
import { spacingTokens } from '../../theme/designSystem';

/**
 * パスキー管理ページコンポーネント
 */
const Passkey: React.FC = () => {
  return (
    <FeatureLayout maxWidth="xl">
      <FeatureHeader
        title="パスキー管理"
        subtitle="生体認証・PIN認証によるパスワードレスログイン機能を管理します"
        showAddButton={false}
      />
      <FeatureContent variant="transparent" padding={spacingTokens.lg}>
        <PasskeyManager />
      </FeatureContent>
    </FeatureLayout>
  );
};

export default Passkey;
