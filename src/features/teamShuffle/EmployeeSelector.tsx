/**
 * 社員選択コンポーネント
 * 
 * 登録済みの社員一覧から選択してチーム分けメンバーに追加する機能
 */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Checkbox,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Alert,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useEmployeeStore, Employee } from '../employeeRegister/useEmployeeStore';
import { useTemporary } from '../../hooks/useTemporary';

interface EmployeeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectEmployees: (selectedEmployees: Employee[]) => void;
  excludeNames?: string[]; // 既に追加済みの名前を除外
}

/**
 * 社員選択ダイアログコンポーネント
 */
export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  open,
  onClose,
  onSelectEmployees,
  excludeNames = [],
}) => {
  const { employees } = useEmployeeStore();
  const { toast } = useTemporary();
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // アクティブな社員のみをフィルタリング
  const activeEmployees = employees.filter(emp => emp.isActive);

  // 検索でフィルタリング
  const filteredEmployees = activeEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 既に追加済みの社員を除外
  const availableEmployees = filteredEmployees.filter(employee => 
    !excludeNames.includes(employee.name)
  );

  /**
   * 社員の選択状態を切り替え
   */
  const handleToggleEmployee = (employeeId: string) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  /**
   * 全選択/全解除
   */
  const handleSelectAll = () => {
    if (selectedEmployeeIds.length === availableEmployees.length) {
      setSelectedEmployeeIds([]);
    } else {
      setSelectedEmployeeIds(availableEmployees.map(emp => emp.id));
    }
  };

  /**
   * 選択した社員を追加
   */
  const handleConfirm = () => {
    const selectedEmployees = activeEmployees.filter(emp => 
      selectedEmployeeIds.includes(emp.id)
    );

    if (selectedEmployees.length === 0) {
      toast.warning('社員を選択してください');
      return;
    }

    onSelectEmployees(selectedEmployees);
    setSelectedEmployeeIds([]);
    setSearchQuery('');
    toast.success(`${selectedEmployees.length}名の社員を追加しました`);
    onClose();
  };

  /**
   * キャンセル
   */
  const handleCancel = () => {
    setSelectedEmployeeIds([]);
    setSearchQuery('');
    onClose();
  };

  /**
   * イニシャル取得
   */
  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          社員選択
        </Typography>
        <Typography variant="body2" color="text.secondary">
          チーム分けに追加する社員を選択してください
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* 検索フィールド */}
        <TextField
          fullWidth
          placeholder="名前、部署、役職、スキルで検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* 統計情報 */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {availableEmployees.length}名の社員が利用可能
            {excludeNames.length > 0 && ` (${excludeNames.length}名は既に追加済み)`}
          </Typography>
          
          {availableEmployees.length > 0 && (
            <Button
              size="small"
              onClick={handleSelectAll}
              sx={{ minWidth: 'auto' }}
            >
              {selectedEmployeeIds.length === availableEmployees.length ? '全解除' : '全選択'}
            </Button>
          )}
        </Box>

        {/* 選択中の社員表示 */}
        {selectedEmployeeIds.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              選択中: {selectedEmployeeIds.length}名
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {selectedEmployeeIds.map(id => {
                const employee = activeEmployees.find(emp => emp.id === id);
                return employee ? (
                  <Chip
                    key={id}
                    label={employee.name}
                    size="small"
                    onDelete={() => handleToggleEmployee(id)}
                    color="primary"
                    variant="outlined"
                  />
                ) : null;
              })}
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>
        )}

        {/* 社員一覧 */}
        {availableEmployees.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {activeEmployees.length === 0 
              ? '登録済みの社員がいません。先に社員管理で社員を登録してください。'
              : excludeNames.length === activeEmployees.length
              ? '全ての社員が既に追加済みです。'
              : '検索条件に一致する社員がいません。'}
          </Alert>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {availableEmployees.map((employee) => (
              <ListItem key={employee.id} disablePadding>
                <ListItemButton
                  onClick={() => handleToggleEmployee(employee.id)}
                  dense
                >
                  <ListItemAvatar>
                    <Checkbox
                      checked={selectedEmployeeIds.includes(employee.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemAvatar>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getInitials(employee.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="bold">
                        {employee.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {employee.department}
                          </Typography>
                          <WorkIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {employee.position}
                          </Typography>
                        </Box>
                        {employee.skills.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {employee.skills.slice(0, 3).map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            ))}
                            {employee.skills.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{employee.skills.length - 3}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCancel} color="inherit">
          キャンセル
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedEmployeeIds.length === 0}
        >
          選択した社員を追加 ({selectedEmployeeIds.length}名)
        </Button>
      </DialogActions>
    </Dialog>
  );
};
