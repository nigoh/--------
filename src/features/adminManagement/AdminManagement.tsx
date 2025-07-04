/**
 * 管理者機能メインページ
 * Super Admin作成、管理者権限管理
 */
import React from 'react';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { AdminUserCreator } from './components/AdminUserCreator';

export const AdminManagement: React.FC = () => {
  return (
    <FeatureLayout maxWidth={false}>
      <FeatureHeader
        title="管理者機能"
        subtitle="Super Admin作成とシステム管理機能"
        showAddButton={false}
      />
      <FeatureContent variant="transparent" padding={0}>
        <AdminUserCreator />
      </FeatureContent>
    </FeatureLayout>
  );
};
