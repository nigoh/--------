import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { SearchField } from './components/SearchField';
import { TeamFilters } from './components/TeamFilters';
import { TeamListTable } from './components/TeamListTable';
import { TeamDialogs } from './components/TeamDialogs';
import { useTeamForm } from './hooks/useTeamForm';
import { useTeamStore, useFilteredTeams } from './stores/useTeamStore';

/**
 * 拡張チーム一覧コンポーネント
 */
export const EnhancedTeamList: React.FC = () => {
  const { searchQuery, setSearchQuery } = useTeamStore();
  const { openCreateDialog } = useTeamForm();
  const filteredTeams = useFilteredTeams();

  // CSVエクスポート機能
  const handleExportCSV = () => {
    const headers = ['チーム名', 'タイプ', 'ステータス', 'メンバー数', '作成日', '説明'];
    
    const csvContent = [
      headers.join(','),
      ...filteredTeams.map(team => [
        `"${team.name}"`,
        `"${team.type}"`,
        `"${team.status}"`,
        team.members.length,
        new Date(team.createdAt).toLocaleDateString('ja-JP'),
        `"${team.description || ''}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `teams_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      {/* ヘッダーセクション */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon fontSize="large" />
          チーム管理
        </Typography>
        <Typography variant="body1" color="text.secondary">
          チームの作成、編集、メンバー管理を行います
        </Typography>
      </Box>

      {/* 統計カード */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              総チーム数
            </Typography>
            <Typography variant="h5">
              {filteredTeams.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              総メンバー数
            </Typography>
            <Typography variant="h5">
              {filteredTeams.reduce((sum, team) => sum + team.members.length, 0)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              アクティブチーム
            </Typography>
            <Typography variant="h5">
              {filteredTeams.filter(team => team.status === 'アクティブ').length}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* 操作バー */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          {/* 検索フィールド */}
          <Box sx={{ flex: 1, maxWidth: 400 }}>
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="チーム名で検索..."
            />
          </Box>

          {/* アクションボタン */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
              disabled={filteredTeams.length === 0}
            >
              CSVエクスポート
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
            >
              チーム新規作成
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* フィルター */}
      <TeamFilters />

      {/* チーム一覧テーブル */}
      <TeamListTable />

      {/* ダイアログ */}
      <TeamDialogs />
    </Box>
  );
};
