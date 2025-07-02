import React from 'react';
import { Box, Button, TextField, Stack, Divider } from '@mui/material';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { EnhancedTeamList } from './EnhancedTeamList';
import { useTeamForm } from './hooks/useTeamForm';
import { useTeamStore } from './stores/useTeamStore';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

/**
 * チーム管理のメインページコンポーネント
 */
const TeamManagement: React.FC = () => {
  const { openCreateDialog } = useTeamForm();
  const { searchQuery, setSearchQuery } = useTeamStore();

  // ヘッダーコンテンツ（検索フィールドと新規追加ボタン）
  const headerActions = (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="チーム名で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              ),
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openCreateDialog}
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
        新しいチーム
      </Button>
    </Box>
  );

  return (
    <FeatureLayout maxWidth={false}>
      <FeatureHeader
        title='チーム管理'
        icon={<GroupIcon fontSize='large' />}
        subtitle="チームの作成、編集、チームメンバー管理を行います。"
        actions={headerActions}
        showAddButton={false}
      />
      
      <FeatureContent variant="transparent" padding={0}>
        <EnhancedTeamList />
      </FeatureContent>
    </FeatureLayout>
  );
};

export default TeamManagement;