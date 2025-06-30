import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { FeatureLayout, FeatureContent, FeatureHeader } from '../../components/layout';
import { EnhancedEmployeeList } from './EnhancedEmployeeList';
import { 
  FadeIn, 
  StaggerContainer, 
  StaggerItem,
} from '../../components/ui/Animation/MotionComponents';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * 社員管理メインページコンポーネント
 */
export const EmployeeRegister: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerAddEmployee, setTriggerAddEmployee] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // 新規社員追加ボタンのハンドラー
  const handleAddEmployee = () => {
    setTriggerAddEmployee(true);
    // リセット用のタイマー
    setTimeout(() => setTriggerAddEmployee(false), 100);
  };

  // フィルター表示切り替えのハンドラー
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // ヘッダーコンテンツ（検索フィールドと新規追加ボタン）
  const headerContents = [
    <Box key="search" sx={{ flex: 1, maxWidth: 500, display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="社員名で検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
        
      />
      <Button
        variant={showFilters ? "contained" : "outlined"}
        size="small"
        onClick={handleToggleFilters}
        startIcon={<FilterListIcon />}
        sx={{
          minWidth: 'auto',
          px: 2,
          borderRadius: 2,
          whiteSpace: 'nowrap',
        }}
      >
      </Button>
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
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
        minWidth: 'auto',
      }}
    >
      新しい社員を追加
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
        <StaggerContainer>
          <StaggerItem>
            <FadeIn>
              <EnhancedEmployeeList 
                externalSearchQuery={searchQuery}
                onExternalSearchChange={setSearchQuery}
                triggerAddEmployee={triggerAddEmployee}
              />
            </FadeIn>
          </StaggerItem>
        </StaggerContainer>
      </FeatureContent>
    </FeatureLayout>
  );
};
