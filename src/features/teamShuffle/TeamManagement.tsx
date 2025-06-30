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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme,
  Stack,
  Chip,
} from '@mui/material';
import { useTeamStore, Team } from './useTeamStore';
import { getMemberColorByName } from './utils';
import TeamListHeader from './components/TeamListHeader';
import TeamCreationDialog from './components/TeamCreationDialog';
import TeamListTable from './components/TeamListTable';

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
  const { teams, addTeam, updateTeam, deleteTeam } = useTeamStore();
  
  // 状態管理
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saveCurrentDialogOpen, setSaveCurrentDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  
  // Form state for editing
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamDescription, setEditTeamDescription] = useState('');
  const [saveTeamName, setSaveTeamName] = useState('');
  const [saveTeamDescription, setSaveTeamDescription] = useState('');

  // アクティブなチームのみ表示
  const activeTeams = teams.filter(team => team.isActive);

  /**
   * 新しいチームを作成
   */
  const handleCreateTeam = (teamData: {
    name: string;
    description: string;
    members: string[];
  }) => {
    addTeam({
      ...teamData,
      color: theme.palette.primary.main,
    });
  };

  /**
   * チームの編集を開始
   */
  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setEditTeamName(team.name);
    setEditTeamDescription(team.description || '');
    setEditDialogOpen(true);
  };

  /**
   * チームの編集を保存
   */
  const handleSaveEdit = () => {
    if (!editingTeam || !editTeamName.trim()) return;
    
    updateTeam(editingTeam.id, {
      name: editTeamName.trim(),
      description: editTeamDescription.trim(),
    });
    
    handleCloseEditDialog();
  };

  /**
   * 編集ダイアログを閉じる
   */
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingTeam(null);
    setEditTeamName('');
    setEditTeamDescription('');
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
   * 現在のチーム分け結果を保存ダイアログを開く
   */
  const handleOpenSaveCurrentDialog = () => {
    if (currentTeams.length === 0) return;
    
    const allMembers = currentTeams.flat();
    setSaveTeamName(`チーム分け結果 ${new Date().toLocaleDateString()}`);
    setSaveTeamDescription(`${currentTeams.length}チーム、${allMembers.length}名のメンバー`);
    setSaveCurrentDialogOpen(true);
  };

  /**
   * 現在のチーム分け結果を保存
   */
  const handleSaveCurrentAsTeam = () => {
    if (!saveTeamName.trim()) return;
    
    const allMembers = currentTeams.flat();
    addTeam({
      name: saveTeamName.trim(),
      description: saveTeamDescription.trim(),
      members: allMembers,
      color: theme.palette.primary.main,
    });
    
    handleCloseSaveCurrentDialog();
  };

  /**
   * 現在のチーム保存ダイアログを閉じる
   */
  const handleCloseSaveCurrentDialog = () => {
    setSaveCurrentDialogOpen(false);
    setSaveTeamName('');
    setSaveTeamDescription('');
  };

  /**
   * チーム展開状態をトグル
   */
  const handleToggleExpand = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  return (
    <Box>
      {/* タイトル */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
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
        チーム管理
      </Typography>

      {/* ヘッダー */}
      <TeamListHeader
        count={activeTeams.length}
        onCreateTeam={() => setCreateDialogOpen(true)}
        onSaveCurrentTeams={handleOpenSaveCurrentDialog}
        hasCurrentTeams={currentTeams.length > 0}
      />

      {/* チーム一覧テーブル */}
      <Box sx={{ mt: 3 }}>
        <TeamListTable
          teams={activeTeams}
          onLoadTeam={handleLoadTeam}
          onEditTeam={handleEditTeam}
          onDeleteTeam={setDeleteConfirmOpen}
          expandedTeams={expandedTeams}
          onToggleExpand={handleToggleExpand}
        />
      </Box>

      {/* チーム作成ダイアログ */}
      <TeamCreationDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreateTeam={handleCreateTeam}
        currentMembers={currentMembers}
      />

      {/* チーム編集ダイアログ */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 }
          }
        }}
      >
        <DialogTitle>
          チームを編集
        </DialogTitle>
        
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="チーム名"
            fullWidth
            variant="outlined"
            value={editTeamName}
            onChange={(e) => setEditTeamName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="説明（任意）"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={editTeamDescription}
            onChange={(e) => setEditTeamDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          {editingTeam && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                メンバー: {editingTeam.members.length}名
              </Alert>
              
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {editingTeam.members.map((member, idx) => (
                  <Chip
                    key={`${member}-${idx}`}
                    label={member}
                    size="small"
                    sx={{
                      backgroundColor: getMemberColorByName(member, editingTeam.members),
                      color: '#ffffff',
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="inherit">
            キャンセル
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={!editTeamName.trim()}
          >
            更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 現在のチーム分け結果保存ダイアログ */}
      <Dialog
        open={saveCurrentDialogOpen}
        onClose={handleCloseSaveCurrentDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 }
          }
        }}
      >
        <DialogTitle>
          チーム分け結果を保存
        </DialogTitle>
        
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="チーム名"
            fullWidth
            variant="outlined"
            value={saveTeamName}
            onChange={(e) => setSaveTeamName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="説明（任意）"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={saveTeamDescription}
            onChange={(e) => setSaveTeamDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            現在のチーム分け: {currentTeams.length}チーム、{currentTeams.flat().length}名
          </Alert>
          
          <Stack spacing={2}>
            {currentTeams.map((team, teamIdx) => (
              <Box key={teamIdx}>
                <Typography variant="subtitle2" gutterBottom>
                  チーム {teamIdx + 1}:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  {team.map((member, memberIdx) => (
                    <Chip
                      key={`${member}-${memberIdx}`}
                      label={member}
                      size="small"
                      sx={{
                        backgroundColor: getMemberColorByName(member, team),
                        color: '#ffffff',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseSaveCurrentDialog} color="inherit">
            キャンセル
          </Button>
          <Button
            onClick={handleSaveCurrentAsTeam}
            variant="contained"
            disabled={!saveTeamName.trim()}
          >
            保存
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