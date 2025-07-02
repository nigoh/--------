import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { FeatureLayout, FeatureContent, FeatureHeader } from '../../components/layout';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { SearchField } from './components/SearchField';
import { EnhancedSettingsList } from './EnhancedSettingsList';
import { useSettingsForm } from './hooks/useSettingsForm';

/**
 * 設定管理メインページコンポーネント
 * MUI v7のデザインに準拠し、レイアウトルールに従った実装
 */
export const Settings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { openCreateDialog } = useSettingsForm();
  
  // 検索クエリ変更のハンドラー
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // 検索フィールドアクション
  const actions = (
    <SearchField 
      searchQuery={searchQuery} 
      onSearchChange={handleSearchChange}
      placeholder="設定名、カテゴリ、説明で検索..."
    />
  );

  return (
    <FeatureLayout maxWidth={false}>
      <FeatureHeader
        title="設定管理"
        icon={<SettingsIcon fontSize="large" />}
        subtitle="システム全体の設定項目を管理します。"
        onAdd={openCreateDialog}
        addButtonText="設定追加"
        actions={actions}
      />
      <FeatureContent variant="transparent" padding={0}>
        <EnhancedSettingsList 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </FeatureContent>
    </FeatureLayout>
  );
};
