/**
 * 権限管理機能メインページ
 */
import React from 'react';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { PermissionGate } from './components/PermissionComponents';
import { UserRole } from '../../auth/types/roles';

export const PermissionManagement: React.FC = () => {
  return (
    <FeatureLayout maxWidth={false}>
      <FeatureHeader
        title="権限管理"
        subtitle="ユーザー権限・ロール管理"
        showAddButton={false}
      />
      <FeatureContent variant="transparent" padding={0}>
        <PermissionGate role={UserRole.ADMIN} showError={true}>
          {/* 権限管理UI（将来実装） */}
          <div>権限管理機能（開発中）</div>
        </PermissionGate>
      </FeatureContent>
    </FeatureLayout>
  );
};
