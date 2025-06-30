import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Shuffle as ShuffleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Team } from '../useTeamStore';
import { getMemberColorByName } from '../utils';

interface TeamListTableProps {
  teams: Team[];
  onLoadTeam: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  expandedTeams: Set<string>;
  onToggleExpand: (teamId: string) => void;
}

export const TeamListTable: React.FC<TeamListTableProps> = ({
  teams,
  onLoadTeam,
  onEditTeam,
  onDeleteTeam,
  expandedTeams,
  onToggleExpand,
}) => {
  const theme = useTheme();

  if (teams.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          チームがありません
        </Typography>
        <Typography variant="body2" color="text.secondary">
          「チーム新規作成」ボタンから新しいチームを作成してください
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>チーム名</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>メンバー数</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>作成日</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>説明</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              操作
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team) => {
            const isExpanded = expandedTeams.has(team.id);
            
            return (
              <React.Fragment key={team.id}>
                <TableRow
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                  }}
                  onClick={() => onToggleExpand(team.id)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {team.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${team.members.length}名`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {team.description || '説明なし'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="チームを読み込み">
                        <IconButton
                          size="small"
                          onClick={() => onLoadTeam(team)}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <ShuffleIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="編集">
                        <IconButton
                          size="small"
                          onClick={() => onEditTeam(team)}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="削除">
                        <IconButton
                          size="small"
                          onClick={() => onDeleteTeam(team.id)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
                
                {/* 展開時のメンバー表示 */}
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 2, backgroundColor: theme.palette.grey[50] }}>
                      <Box sx={{ pl: 4 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          メンバー:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                          {team.members.map((member, idx) => (
                            <Chip
                              key={`${member}-${idx}`}
                              label={member}
                              size="small"
                              sx={{
                                backgroundColor: getMemberColorByName(member, team.members),
                                color: '#ffffff',
                                fontWeight: 500,
                              }}
                            />
                          ))}
                        </Stack>
                        
                        {team.description && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              説明:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {team.description}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamListTable;