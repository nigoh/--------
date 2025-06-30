import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getMemberColorByName } from '../utils';

interface TeamCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: {
    name: string;
    description: string;
    members: string[];
  }) => void;
  currentMembers: string[];
}

export const TeamCreationDialog: React.FC<TeamCreationDialogProps> = ({
  open,
  onClose,
  onCreateTeam,
  currentMembers,
}) => {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [useCurrentMembers, setUseCurrentMembers] = useState(false);

  const handleClose = () => {
    // Reset form
    setTeamName('');
    setTeamDescription('');
    setNewMemberName('');
    setTeamMembers([]);
    setUseCurrentMembers(false);
    onClose();
  };

  const handleAddMember = () => {
    if (newMemberName.trim() && !teamMembers.includes(newMemberName.trim())) {
      setTeamMembers([...teamMembers, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleUseCurrentMembers = () => {
    setTeamMembers(currentMembers);
    setUseCurrentMembers(true);
  };

  const handleCreateTeam = () => {
    const finalMembers = useCurrentMembers ? currentMembers : teamMembers;
    
    if (teamName.trim() && finalMembers.length > 0) {
      onCreateTeam({
        name: teamName.trim(),
        description: teamDescription.trim(),
        members: finalMembers,
      });
      handleClose();
    }
  };

  const finalMembers = useCurrentMembers ? currentMembers : teamMembers;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2 }
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div">
          新しいチームを作成
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* チーム基本情報 */}
          <Box>
            <TextField
              autoFocus
              label="チーム名"
              fullWidth
              variant="outlined"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="例: 開発チーム"
              required
            />
          </Box>

          <Box>
            <TextField
              label="説明（任意）"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="例: フロントエンド開発を担当するチーム"
            />
          </Box>

          <Divider />

          {/* メンバー設定 */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              チームメンバー
            </Typography>

            {currentMembers.length > 0 && !useCurrentMembers && (
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleUseCurrentMembers}
                  >
                    使用する
                  </Button>
                }
              >
                現在のメンバーリスト（{currentMembers.length}名）を使用できます
              </Alert>
            )}

            {!useCurrentMembers && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    size="small"
                    label="メンバー名"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddMember();
                      }
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddMember}
                    disabled={!newMemberName.trim()}
                  >
                    追加
                  </Button>
                </Stack>
              </Box>
            )}

            {/* メンバー一覧 */}
            {finalMembers.length > 0 ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  メンバー ({finalMembers.length}名):
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  {finalMembers.map((member, idx) => (
                    <Chip
                      key={`${member}-${idx}`}
                      label={member}
                      size="small"
                      onDelete={useCurrentMembers ? undefined : () => handleRemoveMember(idx)}
                      sx={{
                        backgroundColor: getMemberColorByName(member, finalMembers),
                        color: '#ffffff',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>

                {useCurrentMembers && (
                  <Button
                    size="small"
                    onClick={() => {
                      setUseCurrentMembers(false);
                      setTeamMembers([]);
                    }}
                    sx={{ mt: 1 }}
                  >
                    手動でメンバーを設定
                  </Button>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 3,
                  color: 'text.secondary',
                }}
              >
                <PersonIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2">
                  メンバーを追加してください
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          キャンセル
        </Button>
        <Button
          onClick={handleCreateTeam}
          variant="contained"
          disabled={!teamName.trim() || finalMembers.length === 0}
        >
          チーム作成
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamCreationDialog;