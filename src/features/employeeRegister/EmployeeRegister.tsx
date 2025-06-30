import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { FeatureLayout, FeatureContent, FeatureHeader } from '../../components/layout';
import { EnhancedEmployeeList } from './EnhancedEmployeeList';
import { EmployeeFilters } from './components/EmployeeFilters';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import { DEPARTMENTS } from './constants/employeeFormConstants';

/**
 * 社員管理メインページコンポーネント
 */
export const EmployeeRegister: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerAddEmployee, setTriggerAddEmployee] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // 新規社員追加ボタンのハンドラー
  const handleAddEmployee = () => {
    setTriggerAddEmployee(true);
    // リセット用のタイマー
    setTimeout(() => setTriggerAddEmployee(false), 100);
  };

  // フィルタークリアのハンドラー
  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('');
    setStatusFilter('');
  };

  // ヘッダーコンテンツ（フィルターと新規追加ボタン）
  const headerContents = [
    <Box key="filters" sx={{ flex: 1, maxWidth: 600 }}>
      <EmployeeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        departments={DEPARTMENTS}
        departmentFilter={departmentFilter}
        statusFilter={statusFilter}
        onDepartmentChange={setDepartmentFilter}
        onStatusChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />
    </Box>,
    <Button
      key="add-employee"
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleAddEmployee}
      sx={{
        borderRadius: 2,
        px: 3,
        py: 1.5,
        fontWeight: 500,
        textTransform: 'none',
        minWidth: 'auto',
        flexShrink: 0,
      }}
    >
      社員登録
    </Button>
  ];

  return (
    <FeatureLayout maxWidth={false}>
      <FeatureHeader
        title='社員管理'
        icon={<GroupIcon fontSize='large' />}
        subtitle="社員の登録、編集、管理を行います。"
        contents={headerContents}
      />
      <FeatureContent variant="transparent" padding={0}>
        <EnhancedEmployeeList 
          externalSearchQuery={searchQuery}
          onExternalSearchChange={setSearchQuery}
          triggerAddEmployee={triggerAddEmployee}
          externalDepartmentFilter={departmentFilter}
          externalStatusFilter={statusFilter}
          onExternalDepartmentChange={setDepartmentFilter}
          onExternalStatusChange={setStatusFilter}
          onExternalClearFilters={handleClearFilters}
          hideFilters={true}
        />
      </FeatureContent>
    </FeatureLayout>
  );
};
