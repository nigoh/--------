/**
 * 権限管理画面
 * 管理者向けのユーザー権限設定インターフェース
 */
import React from 'react';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { UserRole } from '../../auth/types/roles';
import { PermissionGate } from '../../auth/components/PermissionGate';
import { useAuth } from '../../auth';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { EnhancedRoleManagementList } from './EnhancedRoleManagementList';

const RoleManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const handleUserAdd = () => {
    console.log('ユーザー追加機能を実装');
  };

  // デバッグ情報
  console.log('RoleManagement - isAuthenticated:', isAuthenticated);
  console.log('RoleManagement - user:', user);
  console.log('RoleManagement - user roles:', user?.customClaims?.roles);

  // 認証されていない場合の表示
  if (!isAuthenticated) {
    return (
      <FeatureLayout maxWidth={false}>
        <FeatureContent variant="paper" padding={2}>
          <div>ログインが必要です</div>
        </FeatureContent>
      </FeatureLayout>
    );
  }

  return (
    <PermissionGate 
      requiredRole={UserRole.ADMIN}
      fallback={
        <FeatureLayout maxWidth={false}>
          <FeatureContent variant="paper" padding={2}>
            <div>管理者権限が必要です</div>
          </FeatureContent>
        </FeatureLayout>
      }
    >
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
