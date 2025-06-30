import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

interface LegacyTeamManagementProps {
  currentMembers: string[];
  currentTeams: string[][];
  onLoadTeam: (teams: string[][]) => void;
  onSaveCurrentTeams: () => void;
}

/**
 * 既存のチーム管理機能（レガシー）
 * チームシャッフル機能内で使用される
 */
const LegacyTeamManagement: React.FC<LegacyTeamManagementProps> = ({
  currentMembers,
  currentTeams,
  onLoadTeam,
  onSaveCurrentTeams,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        チーム管理（旧機能）
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        この機能は新しいチーム管理機能に移行予定です。<br />
        新機能は左メニューの「チーム管理」からアクセスできます。
      </Alert>
      <Typography variant="body2" color="text.secondary">
        現在のメンバー: {currentMembers.length}人<br />
        現在のチーム: {currentTeams.length}チーム
      </Typography>
    </Box>
  );
};

export default LegacyTeamManagement;