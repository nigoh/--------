import { useCallback } from 'react';
import { useTeamStore } from '../stores/useTeamStore';
import { useTeamFormStore } from '../stores/useTeamFormStore';
import { useEmployeeStore } from '../../employeeRegister/useEmployeeStore';
import { useManagementLoggers } from '../../../hooks/logging';
import type { TeamRole, TeamType, TeamStatus } from '../constants/teamConstants';

/**
 * チーム管理フォームのカスタムフック
 */
export const useTeamForm = () => {
  const teamStore = useTeamStore();
  const formStore = useTeamFormStore();
  const { employees } = useEmployeeStore();
  const { featureLogger, crudLogger } = useManagementLoggers('TeamManagement');

  // フォーム送信処理
  const handleSubmit = useCallback(async () => {
    try {
      formStore.setSubmitting(true);
      formStore.clearErrors();

      // チーム保存試行ログ
      const isEdit = !!formStore.editingTeam;
      await featureLogger.logUserAction(isEdit ? 'team_update_attempt' : 'team_create_attempt', {
        teamId: formStore.editingTeam?.id,
        teamName: formStore.name.trim(),
        teamType: formStore.type,
        memberCount: formStore.members.length
      });

      // バリデーション
      if (!formStore.validateForm()) {
        console.warn('入力内容に不備があります');
        
        // バリデーションエラーログ
        crudLogger.logValidationError({
          teamName: formStore.name.trim() ? undefined : ['チーム名は必須です'],
          teamType: formStore.type ? undefined : ['チームタイプを選択してください'],
          members: formStore.members.length > 0 ? undefined : ['メンバーを追加してください']
        }, {
          operation: isEdit ? 'update' : 'create',
          teamId: formStore.editingTeam?.id
        });
        
        return false;
      }

      // 型安全なチームデータの構築
      const teamData = {
        name: formStore.name.trim(),
        description: formStore.description.trim(),
        type: formStore.type as TeamType,
        status: formStore.status as TeamStatus,
        members: formStore.members,
      };

      if (formStore.editingTeam) {
        // 更新処理
        await crudLogger.logUpdate('team', formStore.editingTeam.id, teamData, {
          previousMemberCount: formStore.editingTeam.members?.length || 0,
          newMemberCount: teamData.members.length
        });
        
        teamStore.updateTeam(formStore.editingTeam.id, teamData);
        
        // チーム更新成功ログ
        await featureLogger.logUserAction('team_update_success', {
          teamId: formStore.editingTeam.id,
          teamName: teamData.name,
          memberCount: teamData.members.length
        });
        
        console.log('チームを更新しました');
      } else {
        // 新規作成処理
        const newTeamId = teamStore.addTeam(teamData);
        
        await crudLogger.logCreate('team', {
          ...teamData,
          id: newTeamId || 'unknown'
        }, {
          memberCount: teamData.members.length,
          teamType: teamData.type
        });
        
        // チーム作成成功ログ
        await featureLogger.logUserAction('team_create_success', {
          teamId: newTeamId,
          teamName: teamData.name,
          teamType: teamData.type,
          memberCount: teamData.members.length
        });
        
        console.log('チームを作成しました');
      }

      formStore.closeDialog();
      return true;
    } catch (error) {
      console.error('チーム保存エラー:', error);
      
      // チーム保存エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('チーム保存エラー'), {
        operation: formStore.editingTeam ? 'update' : 'create',
        teamId: formStore.editingTeam?.id,
        teamName: formStore.name
      });
      
      return false;
    } finally {
      formStore.setSubmitting(false);
    }
  }, [teamStore, formStore, featureLogger, crudLogger]);

  // 社員をメンバーに追加
  const handleAddEmployeeMember = useCallback(() => {
    if (!formStore.selectedEmployeeId) {
      formStore.setError('member', '社員を選択してください');
      return;
    }

    const employee = employees.find(emp => emp.id === formStore.selectedEmployeeId);
    if (!employee) {
      formStore.setError('member', '選択された社員が見つかりません');
      return;
    }

    // メンバー追加ログ
    featureLogger.logUserAction('team_member_add_employee', {
      teamId: formStore.editingTeam?.id,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeEmail: employee.email,
      currentMemberCount: formStore.members.length
    });

    formStore.addMemberFromEmployee(
      employee.id,
      employee.name,
      employee.email
    );
  }, [formStore, employees, featureLogger]);

  // 手動メンバー追加
  const handleAddManualMember = useCallback(() => {
    // 手動メンバー追加ログ
    featureLogger.logUserAction('team_member_add_manual', {
      teamId: formStore.editingTeam?.id,
      currentMemberCount: formStore.members.length
    });

    formStore.addManualMember();
  }, [formStore, featureLogger]);

  // メンバー削除
  const handleRemoveMember = useCallback((memberId: string) => {
    const member = formStore.members.find(m => m.id === memberId);
    
    // メンバー削除ログ
    featureLogger.logUserAction('team_member_remove', {
      teamId: formStore.editingTeam?.id,
      memberId: memberId,
      memberName: member?.name,
      memberType: member?.employeeId ? 'employee' : 'manual',
      remainingMemberCount: formStore.members.length - 1
    });

    formStore.removeMember(memberId);
    console.log('メンバーを削除しました');
  }, [formStore, featureLogger]);

  // メンバーロール更新
  const handleUpdateMemberRole = useCallback((memberId: string, role: TeamRole) => {
    const member = formStore.members.find(m => m.id === memberId);
    
    // メンバーロール更新ログ
    featureLogger.logUserAction('team_member_role_update', {
      teamId: formStore.editingTeam?.id,
      memberId: memberId,
      memberName: member?.name,
      previousRole: member?.role,
      newRole: role
    });

    formStore.updateMemberRole(memberId, role);
  }, [formStore, featureLogger]);

  // チーム削除
  const handleDeleteTeam = useCallback(async (teamId: string) => {
    try {
      const team = teamStore.teams.find(t => t.id === teamId);
      
      // チーム削除試行ログ
      await featureLogger.logUserAction('team_delete_attempt', {
        teamId: teamId,
        teamName: team?.name,
        memberCount: team?.members?.length || 0
      });

      await crudLogger.logDelete('team', teamId, {
        teamName: team?.name,
        memberCount: team?.members?.length || 0,
        teamType: team?.type
      });

      teamStore.deleteTeam(teamId);
      
      // チーム削除成功ログ
      await featureLogger.logUserAction('team_delete_success', {
        teamId: teamId,
        teamName: team?.name
      });

      console.log('チームを削除しました');
      return true;
    } catch (error) {
      console.error('チーム削除エラー:', error);
      
      // チーム削除エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('チーム削除エラー'), {
        teamId: teamId,
        operation: 'delete'
      });
      
      return false;
    }
  }, [teamStore, featureLogger, crudLogger]);

  // ダイアログを開く
  const openCreateDialog = useCallback(() => {
    // チーム作成ダイアログ開始ログ
    featureLogger.logUserAction('team_create_dialog_open', {
      availableEmployeeCount: employees.filter(emp => emp.isActive).length
    });

    formStore.openDialog();
  }, [formStore, featureLogger, employees]);

  const openEditDialog = useCallback((team: any) => {
    // チーム編集ダイアログ開始ログ
    featureLogger.logUserAction('team_edit_dialog_open', {
      teamId: team?.id,
      teamName: team?.name,
      currentMemberCount: team?.members?.length || 0
    });

    formStore.openDialog(team);
  }, [formStore, featureLogger]);

  // ダイアログを閉じる
  const closeDialog = useCallback(() => {
    formStore.closeDialog();
  }, [formStore]);

  // フォームリセット
  const resetForm = useCallback(() => {
    formStore.resetForm();
  }, [formStore]);

  // アクティブな社員リストを取得
  const activeEmployees = employees.filter(emp => emp.isActive);

  // 選択可能な社員リスト（既にメンバーでない社員のみ）
  const availableEmployees = activeEmployees.filter(employee => 
    !formStore.members.some(member => member.employeeId === employee.id)
  );

  return {
    // ストア
    teamStore,
    formStore,
    
    // データ
    employees: activeEmployees,
    availableEmployees,
    
    // アクション
    handleSubmit,
    handleAddEmployeeMember,
    handleAddManualMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleDeleteTeam,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    resetForm,
  };
};
