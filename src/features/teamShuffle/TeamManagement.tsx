/**
 * チーム管理コンポーネント
 * 
 * 保存されたチームの表示・編集・削除・選択機能を提供
 */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tooltip,
  useTheme,
  Fade,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import { useTeamStore, Team } from './useTeamStore';
import { getMemberColorByName } from './utils';

interface TeamManagementProps {
  currentMembers: string[];
  currentTeams: string[][];
  onLoadTeam: (teams: string[][]) => void;
  onSaveCurrentTeams: () => void;
}

/**
 * チーム管理コンポーネント
 */
const TeamManagement: React.FC<TeamManagementProps> = ({
  currentMembers,
  currentTeams,
  onLoadTeam,
  onSaveCurrentTeams,
}) => {
  const theme = useTheme();
  const { teams, addTeam, updateTeam, deleteTeam, toggleTeamStatus } = useTeamStore();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);

  // アクティブなチームのみ表示
  const activeTeams = teams.filter(team => team.isActive);

  /**
   * 新しいチームを保存
   */
  const handleSaveTeam = () => {
    if (!teamName.trim()) return;
    
    const teamData = {
      name: teamName.trim(),
      description: teamDescription.trim(),
      members: currentMembers,
      color: theme.palette.primary.main,
    };

    if (editingTeam) {
      updateTeam(editingTeam.id, teamData);
    } else {
      addTeam(teamData);
    }

    handleCloseSaveDialog();
  };

  /**
   * 保存ダイアログを閉じる
   */
  const handleCloseSaveDialog = () => {
    setSaveDialogOpen(false);
    setEditingTeam(null);
    setTeamName('');
    setTeamDescription('');
  };

  /**
   * チームの編集を開始
   */
  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setTeamDescription(team.description || '');
    setSaveDialogOpen(true);
  };

  /**
   * チームの削除確認
   */
  const handleDeleteTeam = (teamId: string) => {
    deleteTeam(teamId);
    setDeleteConfirmOpen(null);
  };

  /**
   * チームを読み込み
   */
  const handleLoadTeam = (team: Team) => {
    const teamsByMembers: string[][] = [];
    
    // メンバーを1人ずつのチームとして読み込み
    team.members.forEach(member => {
      teamsByMembers.push([member]);
    });
    
    onLoadTeam(teamsByMembers);
  };

  /**
   * 現在のチーム分け結果を保存
   */
  const handleSaveCurrentAsTeam = () => {
    if (currentTeams.length === 0) return;
    
    // 現在のチーム分け結果を単一のメンバーリストに変換
    const allMembers = currentTeams.flat();
    setTeamName(`チーム分け結果 ${new Date().toLocaleDateString()}`);
    setTeamDescription(`${currentTeams.length}チーム、${allMembers.length}名のメンバー`);
    setSaveDialogOpen(true);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* タイトル */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box 
          sx={{ 
            width: 4, 
            height: 24, 
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 2
          }} 
        />
        保存済みチーム
      </Typography>

      {/* 操作ボタン */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setSaveDialogOpen(true)}
          disabled={currentMembers.length === 0}
          sx={{ borderRadius: 2 }}
        >
          現在のメンバーを保存
        </Button>
        
        {currentTeams.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveCurrentAsTeam}
            sx={{ borderRadius: 2 }}
          >
            チーム分け結果を保存
          </Button>
        )}
      </Stack>

      {/* 保存済みチーム一覧 */}
      {activeTeams.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
          <GroupIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            保存済みのチームがありません
          </Typography>
          <Typography variant="caption" color="text.secondary">
            現在のメンバーを保存してチームを管理しましょう
          </Typography>
        </Paper>
      ) : (
        <Box>
          {activeTeams.map((team) => (
            <Fade in key={team.id} timeout={300}>
              <Accordion
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? theme.palette.grey[800] 
                      : theme.palette.grey[50],
                    borderRadius: 2,
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {team.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {team.members.length}名のメンバー • {new Date(team.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="チームを読み込み">
                        <IconButton
                          size="small"
                          onClick={() => handleLoadTeam(team)}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <ShuffleIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="編集">
                        <IconButton
                          size="small"
                          onClick={() => handleEditTeam(team)}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="削除">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteConfirmOpen(team.id)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  {team.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {team.description}
                    </Typography>
                  )}
                  
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
                </AccordionDetails>
              </Accordion>
            </Fade>
          ))}
        </Box>
      )}

      {/* チーム保存ダイアログ */}
      <Dialog
        open={saveDialogOpen}
        onClose={handleCloseSaveDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 }
          }
        }}
      >
        <DialogTitle>
          {editingTeam ? 'チームを編集' : 'チームを保存'}
        </DialogTitle>
        
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="チーム名"
            fullWidth
            variant="outlined"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="説明（任意）"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            現在のメンバー: {currentMembers.length}名
          </Alert>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            {currentMembers.map((member, idx) => (
              <Chip
                key={`${member}-${idx}`}
                label={member}
                size="small"
                sx={{
                  backgroundColor: getMemberColorByName(member, currentMembers),
                  color: '#ffffff',
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseSaveDialog} color="inherit">
            キャンセル
          </Button>
          <Button
            onClick={handleSaveTeam}
            variant="contained"
            disabled={!teamName.trim()}
          >
            {editingTeam ? '更新' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteConfirmOpen !== null}
        onClose={() => setDeleteConfirmOpen(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>チームを削除</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            このチームを削除してもよろしいですか？この操作は取り消せません。
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(null)} color="inherit">
            キャンセル
          </Button>
          <Button
            onClick={() => deleteConfirmOpen && handleDeleteTeam(deleteConfirmOpen)}
            variant="contained"
            color="error"
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;