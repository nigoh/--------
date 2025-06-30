import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import { useTeamForm } from '../hooks/useTeamForm';
import { TEAM_ROLES } from '../constants/teamConstants';
import type { TeamRole } from '../constants/teamConstants';

/**
 * チームメンバー選択・管理コンポーネント
 */
export const TeamMemberSelector: React.FC = () => {
  const {
    formStore,
    availableEmployees,
    handleAddEmployeeMember,
    handleAddManualMember,
    handleRemoveMember,
    handleUpdateMemberRole,
  } = useTeamForm();

  const handleEmployeeChange = (value: string) => {
    formStore.updateField('selectedEmployeeId', value);
  };

  const handleRoleChange = (value: string) => {
    formStore.updateField('memberRole', value as TeamRole);
  };

  const handleManualNameChange = (value: string) => {
    formStore.updateField('manualMemberName', value);
  };

  const handleManualEmailChange = (value: string) => {
    formStore.updateField('manualMemberEmail', value);
  };

  const getRoleColor = (role: TeamRole) => {
    switch (role) {
      case 'リーダー':
        return 'primary';
      case 'サブリーダー':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GroupIcon />
        チームメンバー
      </Typography>

      {/* ロール選択 */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>追加するメンバーのロール</InputLabel>
        <Select
          value={formStore.memberRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          label="追加するメンバーのロール"
        >
          {TEAM_ROLES.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 社員からの追加 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          社員名簿から追加
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <FormControl fullWidth size="small">
            <InputLabel>社員を選択</InputLabel>
            <Select
              value={formStore.selectedEmployeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              label="社員を選択"
            >
              <MenuItem value="">
                <em>選択してください</em>
              </MenuItem>
              {availableEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name} ({employee.department})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleAddEmployeeMember}
            disabled={!formStore.selectedEmployeeId}
            startIcon={<PersonAddIcon />}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            追加
          </Button>
        </Box>
        {formStore.errors.member && (
          <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            {formStore.errors.member}
          </Typography>
        )}
      </Paper>

      {/* 手動追加 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          手動で追加
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            label="名前"
            value={formStore.manualMemberName}
            onChange={(e) => handleManualNameChange(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            error={!!formStore.errors.manualMember}
          />
          <TextField
            size="small"
            label="メールアドレス（任意）"
            value={formStore.manualMemberEmail}
            onChange={(e) => handleManualEmailChange(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            type="email"
          />
          <Button
            variant="contained"
            onClick={handleAddManualMember}
            disabled={!formStore.manualMemberName.trim()}
            startIcon={<PersonAddIcon />}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            追加
          </Button>
        </Box>
        {formStore.errors.manualMember && (
          <Typography color="error" variant="caption">
            {formStore.errors.manualMember}
          </Typography>
        )}
      </Paper>

      {/* メンバー一覧 */}
      <Paper sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            現在のメンバー ({formStore.members.length}人)
          </Typography>
        </Box>
        <Divider />
        
        {formStore.members.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              メンバーが追加されていません
            </Typography>
          </Box>
        ) : (
          <List dense>
            {formStore.members.map((member) => (
              <ListItem key={member.id}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {member.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={member.role}
                        color={getRoleColor(member.role)}
                        variant="outlined"
                      />
                      {member.source === 'employee' && (
                        <Chip size="small" label="社員" color="info" variant="outlined" />
                      )}
                    </Box>
                  }
                  secondary={member.email}
                />
                <ListItemSecondaryAction>
                  <FormControl size="small" sx={{ mr: 1, minWidth: 80 }}>
                    <Select
                      value={member.role}
                      onChange={(e) => handleUpdateMemberRole(member.id, e.target.value as TeamRole)}
                      variant="outlined"
                    >
                      {TEAM_ROLES.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveMember(member.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
        
        {formStore.errors.members && (
          <Box sx={{ p: 2 }}>
            <Typography color="error" variant="caption">
              {formStore.errors.members}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
