import { useCallback } from 'react';
import { useSettingsFormStore } from '../stores/useSettingsFormStore';

/**
 * 設定フォームを管理するカスタムフック
 * Zustandストアを使用して状態管理
 */
export const useSettingsForm = () => {
  const {
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    selectedSetting,
    formData,
    setCreateDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setSelectedSetting,
    setFormData,
    resetForm,
  } = useSettingsFormStore();

  // 作成ダイアログを開く
  const openCreateDialog = useCallback(() => {
    resetForm();
    setCreateDialogOpen(true);
  }, [resetForm, setCreateDialogOpen]);

  // 編集ダイアログを開く
  const openEditDialog = useCallback((setting) => {
    setSelectedSetting(setting);
    setFormData({
      id: setting.id,
      name: setting.name,
      category: setting.category,
      value: setting.value,
      description: setting.description,
    });
    setEditDialogOpen(true);
  }, [setSelectedSetting, setFormData, setEditDialogOpen]);

  // 削除ダイアログを開く
  const openDeleteDialog = useCallback((setting) => {
    setSelectedSetting(setting);
    setDeleteDialogOpen(true);
  }, [setSelectedSetting, setDeleteDialogOpen]);

  // ダイアログを閉じる
  const closeDialogs = useCallback(() => {
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
  }, [setCreateDialogOpen, setEditDialogOpen, setDeleteDialogOpen]);

  return {
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    selectedSetting,
    formData,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialogs,
    setFormData,
    resetForm,
  };
};
