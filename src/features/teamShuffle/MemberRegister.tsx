import React, { useState } from 'react';
import { Box, TextField, Button, Chip, Paper, Typography, Stack, Container, Fade, keyframes } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getMemberColor } from './utils';

// チップのアニメーション定義
const chipSlideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(-20px) scale(0.8); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
`;

const buttonPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(103, 126, 234, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(103, 126, 234, 0); }
  100% { box-shadow: 0 0 0 0 rgba(103, 126, 234, 0); }
`;

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
  const [input, setInput] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

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

  return (
    <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 }, mb: 4 }}>
      <Paper 
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          maxWidth: 800, 
          mx: 'auto',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(103, 126, 234, 0.1)',
        }} 
        elevation={3}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          名簿リスト
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
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
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 0 0 2px rgba(103, 126, 234, 0.2)',
                },
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleAdd} 
            disabled={!input.trim()}
            startIcon={<AddIcon />}
            sx={{
              minWidth: 100,
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(103, 126, 234, 0.3)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(103, 126, 234, 0.4)',
                animation: input.trim() ? `${buttonPulse} 2s infinite` : 'none',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                transform: 'none',
                animation: 'none',
              },
            }}
          >
            追加
          </Button>
        </Stack>
        
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
            {members.map((name, idx) => {
              if (editIdx === idx) {
                return (
                  <Fade in key={`edit-${name}-${idx}`}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Button 
                        size="small" 
                        onClick={() => handleEditSave(idx)}
                        sx={{ 
                          minWidth: 'auto',
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
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
                      fontSize: '0.9rem',
                      borderRadius: 2,
                      px: 1,
                      boxShadow: `0 2px 8px ${color}40`,
                      animation: `${chipSlideIn} 0.3s ease-out ${idx * 0.05}s both`,
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: `0 4px 12px ${color}60`,
                        bgcolor: color,
                      },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(255, 255, 255, 0.8)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#ffffff',
                          transform: 'scale(1.2)',
                        },
                      },
                    }}
                  />
                </Fade>
              );
            })}
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default MemberRegister;
