import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
      {/* 統計Chips ＆ CSVエクスポートボタン */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<GroupIcon />}
          label={`総チーム数: ${filteredTeams.length}`}
          variant="filled"
          color="primary"
          size="medium"
          sx={{ px: 1 }}
        />
        <Chip
          icon={<PeopleIcon />}
          label={`総メンバー数: ${filteredTeams.reduce((sum, team) => sum + team.members.length, 0)}`}
          variant="filled"
          color="info"
          size="medium"
          sx={{ px: 1 }}
        />
        <Chip
          icon={<CheckCircleIcon />}
          label={`アクティブチーム: ${filteredTeams.filter(team => team.status === 'アクティブ').length}`}
          variant="filled"
          color="success"
          size="medium"
          sx={{ px: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportCSV}
          disabled={filteredTeams.length === 0}
        >
          CSVエクスポート
        </Button>
      </Stack>

      {/* フィルター */}
      <TeamFilters />

      {/* チーム一覧テーブル */}
      <TeamListTable />

      {/* ダイアログ */}
      <TeamDialogs />
    </Box>
  );
};
