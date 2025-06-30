import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import { useTeamStore, useFilteredTeams } from '../stores/useTeamStore';
import { useTeamForm } from '../hooks/useTeamForm';
import type { Team } from '../stores/useTeamStore';

/**
 * チーム一覧テーブルコンポーネント
 */
export const TeamListTable: React.FC = () => {
  const {
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
  } = useTeamStore();
  
  const filteredTeams = useFilteredTeams();
  const { openEditDialog, handleDeleteTeam } = useTeamForm();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (team: Team) => {
    openEditDialog(team);
  };

  const handleDelete = async (teamId: string) => {
    if (window.confirm('このチームを削除してもよろしいですか？')) {
      await handleDeleteTeam(teamId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'アクティブ':
        return 'success';
      case '休止中':
        return 'warning';
      case '完了':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'プロジェクトチーム':
        return 'primary';
      case '常設チーム':
        return 'secondary';
      case 'タスクフォース':
        return 'info';
      case '委員会':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  if (filteredTeams.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <GroupIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          チームが見つかりません
        </Typography>
        <Typography color="text.secondary">
          検索条件を変更するか、新しいチームを作成してください。
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === 'name'}
                direction={sortField === 'name' ? sortDirection : 'asc'}
                onClick={() => handleSort('name')}
              >
                チーム名
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'type'}
                direction={sortField === 'type' ? sortDirection : 'asc'}
                onClick={() => handleSort('type')}
              >
                タイプ
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'status'}
                direction={sortField === 'status' ? sortDirection : 'asc'}
                onClick={() => handleSort('status')}
              >
                ステータス
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'memberCount'}
                direction={sortField === 'memberCount' ? sortDirection : 'asc'}
                onClick={() => handleSort('memberCount')}
              >
                メンバー
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'createdAt'}
                direction={sortField === 'createdAt' ? sortDirection : 'asc'}
                onClick={() => handleSort('createdAt')}
              >
                作成日
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTeams.map((team) => (
            <TableRow key={team.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {team.name}
                  </Typography>
                  {team.description && (
                    <Typography variant="caption" color="text.secondary">
                      {team.description.length > 50 
                        ? `${team.description.substring(0, 50)}...` 
                        : team.description
                      }
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={team.type}
                  color={getTypeColor(team.type) as any}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={team.status}
                  color={getStatusColor(team.status) as any}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                    {team.members.slice(0, 3).map((member) => (
                      <Tooltip key={member.id} title={`${member.name} (${member.role})`}>
                        <Avatar sx={{ fontSize: '0.75rem' }}>
                          {member.name.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                  <Typography variant="body2">
                    {team.members.length}人
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(team.createdAt)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => handleEdit(team)}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(team.id)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};