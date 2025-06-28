import React, { useState } from 'react';
import { Box, TextField, Button, Chip, Typography, Stack, Fade, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getMemberColor } from './utils';
import { EmployeeSelector } from './EmployeeSelector';
import { Employee } from '../employeeRegister/useEmployeeStore';

/**
 * 名簿登録用コンポーネント
 */
export interface MemberRegisterProps {
  members: string[];
  onAddMember: (name: string) => void;
  onRemoveMember: (index: number) => void;
  onEditMember?: (index: number, newName: string) => void;
  renderListItem?: (name: string, idx: number, children: React.ReactElement<any, any>) => React.ReactNode;
}

const MemberRegister = ({ members, onAddMember, onRemoveMember, onEditMember, renderListItem }: MemberRegisterProps) => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [employeeSelectorOpen, setEmployeeSelectorOpen] = useState(false);

  const handleAdd = () => {
    const name = input.trim();
    if (name && !members.includes(name)) {
      onAddMember(name);
      setInput('');
    }
  };

  const handleEdit = (idx: number, name: string) => {
    setEditIdx(idx);
    setEditValue(name);
  };

  const handleEditSave = (idx: number) => {
    const newName = editValue.trim();
    if (!newName || members.includes(newName)) return;
    onEditMember && onEditMember(idx, newName);
    setEditIdx(null);
    setEditValue('');
  };

  /**
   * 社員選択から追加
   */
  const handleSelectEmployees = (selectedEmployees: Employee[]) => {
    selectedEmployees.forEach(employee => {
      if (!members.includes(employee.name)) {
        onAddMember(employee.name);
      }
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
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
        名簿リスト
      </Typography>
      
      {/* 入力エリア - セカンダリカラー25% */}
      <Box 
        sx={{ 
          p: 2,
          mb: 3,
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[800] 
            : theme.palette.grey[50],
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {/* メインカラー70% - 入力フィールド */}
          <TextField
            label="名前を入力"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { 
              if (e.key === 'Enter') handleAdd(); 
            }}
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          />
          
          {/* アクションボタン */}
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            {/* アクセントカラー5% - 追加ボタン */}
            <Button 
              variant="contained" 
              onClick={handleAdd} 
              disabled={!input.trim()}
              startIcon={<AddIcon />}
              sx={{
                minWidth: { xs: '100%', sm: 120 },
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground,
                  transform: 'none',
                },
                transition: 'all 0.2s ease',
              }}
            >
              追加
            </Button>
            
            {/* セカンダリボタン */}
            <Button 
              variant="outlined" 
              onClick={() => setEmployeeSelectorOpen(true)}
              startIcon={<PersonAddIcon />}
              sx={{
                minWidth: { xs: '100%', sm: 140 },
                borderRadius: 2,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.background.paper,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.primary.main + '10',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              社員選択
            </Button>
          </Stack>
        </Stack>
      </Box>
      
      {/* メンバー表示エリア - メインカラー70% */}
      <Box sx={{ 
        minHeight: 120,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}>
        {members.length === 0 ? (
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              textAlign: 'center',
              py: 4,
              fontStyle: 'italic'
            }}
          >
            メンバーがまだ登録されていません
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
            {members.map((name, idx) => {
              if (editIdx === idx) {
                return (
                  <Fade in key={`edit-${name}-${idx}`}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <TextField
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(idx);
                          if (e.key === 'Escape') setEditIdx(null);
                        }}
                        size="small"
                        autoFocus
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Button 
                        size="small" 
                        onClick={() => handleEditSave(idx)}
                        variant="contained"
                        sx={{ 
                          minWidth: 'auto',
                          borderRadius: 2,
                          background: theme.palette.primary.main,
                          '&:hover': {
                            background: theme.palette.primary.dark,
                          },
                        }}
                      >
                        保存
                      </Button>
                    </Box>
                  </Fade>
                );
              }
              
              // 統一されたカラーパレットを使用
              const color = getMemberColor(idx);
              
              return (
                <Fade in key={name + idx} timeout={300 + idx * 50}>
                  <Chip
                    label={name}
                    onDelete={() => onRemoveMember(idx)}
                    onClick={() => handleEdit(idx, name)}
                    deleteIcon={<DeleteIcon />}
                    sx={{ 
                      mb: 1, 
                      bgcolor: color, 
                      color: '#ffffff', 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      borderRadius: 2,
                      px: 1,
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-1px) scale(1.02)',
                        boxShadow: `0 4px 8px ${color}60`,
                        bgcolor: color,
                      },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(255, 255, 255, 0.8)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#ffffff',
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  />
                </Fade>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* 社員選択ダイアログ */}
      <EmployeeSelector
        open={employeeSelectorOpen}
        onClose={() => setEmployeeSelectorOpen(false)}
        onSelectEmployees={handleSelectEmployees}
        excludeNames={members}
      />
    </Box>
  );
};

export default MemberRegister;
