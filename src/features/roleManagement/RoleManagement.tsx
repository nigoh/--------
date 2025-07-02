/**
 * 権限管理画面
 * 管理者向けのユーザー権限設定インターフェース
 */
import React from 'react';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { UserRole } from '../../auth/types/roles';
import { PermissionGate } from '../../auth/components/PermissionGate';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { EnhancedRoleManagementList } from './EnhancedRoleManagementList';

const RoleManagement: React.FC = () => {
  const handleUserAdd = () => {
    console.log('ユーザー追加機能を実装');
  };

  return (
    <PermissionGate requiredRole={UserRole.ADMIN}>
      <FeatureLayout maxWidth={false}>
        <FeatureHeader
          title="権限管理"
          subtitle="ユーザーのロールと権限を管理します"
          buttons={[
            {
              text: "ユーザー追加",
              onClick: handleUserAdd,
              variant: "outlined",
              icon: <PersonAddIcon />
            }
          ]}
        />
        
        <FeatureContent variant="transparent" padding={0}>
          <EnhancedRoleManagementList />
        </FeatureContent>
      </FeatureLayout>
    </PermissionGate>
  );
};

export default RoleManagement;
