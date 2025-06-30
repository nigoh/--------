import { useCallback } from 'react';
import { useTeamStore } from '../stores/useTeamStore';
import { useTeamFormStore } from '../stores/useTeamFormStore';
import { useEmployeeStore } from '../../employeeRegister/useEmployeeStore';
import type { TeamRole, TeamType, TeamStatus } from '../constants/teamConstants';

/**
 * チーム管理フォームのカスタムフック
 */
export const useTeamForm = () => {
  const teamStore = useTeamStore();
  const formStore = useTeamFormStore();
  const { employees } = useEmployeeStore();

  // フォーム送信処理
  const handleSubmit = useCallback(async () => {
    try {
      formStore.setSubmitting(true);
      formStore.clearErrors();

      // バリデーション
      if (!formStore.validateForm()) {
        console.warn('入力内容に不備があります');
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
        teamStore.updateTeam(formStore.editingTeam.id, teamData);
        console.log('チームを更新しました');
      } else {
        // 新規作成処理
        teamStore.addTeam(teamData);
        console.log('チームを作成しました');
      }

      formStore.closeDialog();
      return true;
    } catch (error) {
      console.error('チーム保存エラー:', error);
      return false;
    } finally {
      formStore.setSubmitting(false);
    }
  }, [teamStore, formStore]);

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

    formStore.addMemberFromEmployee(
      employee.id,
      employee.name,
      employee.email
    );
  }, [formStore, employees]);

  // 手動メンバー追加
  const handleAddManualMember = useCallback(() => {
    formStore.addManualMember();
  }, [formStore]);

  // メンバー削除
  const handleRemoveMember = useCallback((memberId: string) => {
    formStore.removeMember(memberId);
    console.log('メンバーを削除しました');
  }, [formStore]);

  // メンバーロール更新
  const handleUpdateMemberRole = useCallback((memberId: string, role: TeamRole) => {
    formStore.updateMemberRole(memberId, role);
  }, [formStore]);

  // チーム削除
  const handleDeleteTeam = useCallback(async (teamId: string) => {
    try {
      teamStore.deleteTeam(teamId);
      console.log('チームを削除しました');
      return true;
    } catch (error) {
      console.error('チーム削除エラー:', error);
      return false;
    }
  }, [teamStore]);

  // ダイアログを開く
  const openCreateDialog = useCallback(() => {
    formStore.openDialog();
  }, [formStore]);

  const openEditDialog = useCallback((team: any) => {
    formStore.openDialog(team);
  }, [formStore]);

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
