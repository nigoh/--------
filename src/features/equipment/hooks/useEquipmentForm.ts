import { useCallback } from 'react';
import { useBusinessLoggers } from '../../../hooks/logging';
import { useEquipmentStore, EquipmentItem } from '../useEquipmentStore';
import { useTemporary } from '../../../hooks/useTemporary';

/**
 * 備品管理操作のロギング付きフック
 */
export const useEquipmentForm = () => {
  const { addItem, updateItem, deleteItem, adjustStock } = useEquipmentStore();
  const { toast, progress } = useTemporary();
  const { featureLogger, crudLogger, searchLogger } = useBusinessLoggers('EquipmentManagement');

  /**
   * 備品登録
   */
  const handleCreateEquipment = useCallback(async (equipmentData: Omit<EquipmentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // 備品登録開始ログ
      featureLogger.logUserAction('equipment_create_attempt', {
        name: equipmentData.name,
        category: equipmentData.category,
        quantity: equipmentData.quantity,
        hasNote: !!equipmentData.note
      });

      progress.start('備品を登録中...', 1);

      // 備品データ追加
      const equipmentId = crypto.randomUUID();
      const newEquipment = {
        ...equipmentData,
        id: equipmentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      addItem(equipmentData);

      // CRUD操作ログ
      await crudLogger.logCreate('equipment', newEquipment, {
        category: equipmentData.category,
        initialQuantity: equipmentData.quantity,
        hasNote: !!equipmentData.note
      });

      progress.complete();
      
      // 成功ログ
      featureLogger.logUserAction('equipment_create_success', {
        equipmentId: equipmentId,
        name: equipmentData.name,
        category: equipmentData.category,
        quantity: equipmentData.quantity
      });

      toast.success(`${equipmentData.name}を登録しました`);
      setTimeout(() => progress.clear(), 1000);

    } catch (error) {
      progress.error();
      
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Equipment creation failed'), {
        action: 'equipment_create',
        name: equipmentData.name,
        category: equipmentData.category
      });

      toast.error('備品登録に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  }, [addItem, crudLogger, featureLogger, toast, progress]);

  /**
   * 備品更新
   */
  const handleUpdateEquipment = useCallback(async (id: string, updates: Partial<Omit<EquipmentItem, 'id'>>) => {
    try {
      // 更新開始ログ
      featureLogger.logUserAction('equipment_update_attempt', {
        equipmentId: id,
        updateFields: Object.keys(updates)
      });

      progress.start('備品情報を更新中...', 1);

      // 備品データ更新
      updateItem(id, updates);

      // CRUD操作ログ
      await crudLogger.logUpdate('equipment', id, updates, {
        changedFields: Object.keys(updates),
        hasQuantityChange: updates.quantity !== undefined,
        hasCategoryChange: updates.category !== undefined,
        hasNameChange: updates.name !== undefined
      });

      progress.complete();
      
      // 成功ログ
      featureLogger.logUserAction('equipment_update_success', {
        equipmentId: id,
        updatedFields: Object.keys(updates)
      });

      toast.success('備品情報を更新しました');
      setTimeout(() => progress.clear(), 1000);

    } catch (error) {
      progress.error();
      
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Equipment update failed'), {
        action: 'equipment_update',
        equipmentId: id,
        updateFields: Object.keys(updates)
      });

      toast.error('備品更新に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  }, [updateItem, crudLogger, featureLogger, toast, progress]);

  /**
   * 備品削除
   */
  const handleDeleteEquipment = useCallback(async (equipment: EquipmentItem) => {
    try {
      // 削除開始ログ
      featureLogger.logUserAction('equipment_delete_attempt', {
        equipmentId: equipment.id,
        name: equipment.name,
        category: equipment.category,
        quantity: equipment.quantity
      });

      progress.start('備品を削除中...', 1);

      // 備品データ削除
      deleteItem(equipment.id);

      // CRUD操作ログ
      await crudLogger.logDelete('equipment', equipment.id, {
        name: equipment.name,
        category: equipment.category,
        finalQuantity: equipment.quantity
      });

      progress.complete();
      
      // 成功ログ
      featureLogger.logUserAction('equipment_delete_success', {
        equipmentId: equipment.id,
        name: equipment.name
      });

      toast.success(`${equipment.name}を削除しました`);
      setTimeout(() => progress.clear(), 1000);

    } catch (error) {
      progress.error();
      
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Equipment delete failed'), {
        action: 'equipment_delete',
        equipmentId: equipment.id,
        name: equipment.name
      });

      toast.error('備品削除に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  }, [deleteItem, crudLogger, featureLogger, toast, progress]);

  /**
   * 在庫調整
   */
  const handleStockAdjustment = useCallback(async (equipment: EquipmentItem, delta: number, reason: string) => {
    try {
      // 在庫調整開始ログ
      featureLogger.logUserAction('stock_adjustment_attempt', {
        equipmentId: equipment.id,
        name: equipment.name,
        currentQuantity: equipment.quantity,
        delta: delta,
        newQuantity: equipment.quantity + delta,
        reason: reason,
        adjustmentType: delta > 0 ? 'increase' : 'decrease'
      });

      progress.start('在庫を調整中...', 1);

      // 在庫調整実行
      adjustStock(equipment.id, delta);

      // CRUD操作ログ（在庫調整は特別な更新操作として記録）
      await crudLogger.logUpdate('equipment_stock', equipment.id, {
        quantity: equipment.quantity + delta
      }, {
        adjustmentType: delta > 0 ? 'increase' : 'decrease',
        delta: Math.abs(delta),
        reason: reason,
        previousQuantity: equipment.quantity,
        newQuantity: equipment.quantity + delta
      });

      progress.complete();
      
      // 成功ログ
      featureLogger.logUserAction('stock_adjustment_success', {
        equipmentId: equipment.id,
        name: equipment.name,
        delta: delta,
        newQuantity: equipment.quantity + delta,
        reason: reason
      });

      const actionLabel = delta > 0 ? '入庫' : '出庫';
      toast.success(`${equipment.name}の${actionLabel}を記録しました（${Math.abs(delta)}個）`);
      setTimeout(() => progress.clear(), 1000);

    } catch (error) {
      progress.error();
      
      // エラーログ
      featureLogger.logError(error instanceof Error ? error : new Error('Stock adjustment failed'), {
        action: 'stock_adjustment',
        equipmentId: equipment.id,
        name: equipment.name,
        delta: delta,
        reason: reason
      });

      toast.error('在庫調整に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  }, [adjustStock, crudLogger, featureLogger, toast, progress]);

  /**
   * 備品検索
   */
  const handleEquipmentSearch = useCallback((query: string, category: string, items: EquipmentItem[]) => {
    // 検索実行ログ
    searchLogger.logSearch(query, {
      hasQuery: !!query,
      hasCategory: !!category,
      totalItems: items.length
    });

    // 検索実行
    const filteredItems = items.filter(item => {
      const matchesQuery = !query || 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.note && item.note.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !category || item.category === category;
      
      return matchesQuery && matchesCategory;
    });

    // 検索結果ログ
    searchLogger.logSearchResults(filteredItems.length, {
      query: query,
      category: category,
      totalItems: items.length,
      effectiveness: filteredItems.length / items.length,
      hasResults: filteredItems.length > 0
    });

    return filteredItems;
  }, [searchLogger]);

  /**
   * 低在庫アラート
   */
  const handleLowStockCheck = useCallback((items: EquipmentItem[], threshold: number = 5) => {
    const lowStockItems = items.filter(item => item.quantity <= threshold);
    
    if (lowStockItems.length > 0) {
      // 低在庫アラートログ
      featureLogger.logUserAction('low_stock_alert', {
        threshold: threshold,
        lowStockCount: lowStockItems.length,
        totalItems: items.length,
        lowStockItems: lowStockItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity
        }))
      });

      toast.info(`${lowStockItems.length}件の備品が在庫不足です（${threshold}個以下）`);
    }

    return lowStockItems;
  }, [featureLogger, toast]);

  return {
    handleCreateEquipment,
    handleUpdateEquipment,
    handleDeleteEquipment,
    handleStockAdjustment,
    handleEquipmentSearch,
    handleLowStockCheck
  };
};
