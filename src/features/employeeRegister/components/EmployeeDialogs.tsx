import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, Box, Chip } from '@mui/material';
import { Employee } from '../useEmployeeStore';

interface Props {
  selected: Employee | null;
  onCloseDetail: () => void;
  deleteOpen: boolean;
  deleting: Employee | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  formatDate: (d: string) => string;
}

const EmployeeDialogs: React.FC<Props> = ({ selected, onCloseDetail, deleteOpen, deleting, onCancelDelete, onConfirmDelete, formatDate }) => (
  <>
    <Dialog open={!!selected} onClose={onCloseDetail} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2, background: 'linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)' } }}>
      {selected && (
        <>
          <DialogTitle sx={{ background: 'linear-gradient(45deg,#2196F3 30%,#21CBF3 90%)', color: 'white', fontWeight: 'bold' }}>{selected.name} の詳細情報</DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>基本情報</Typography>
                <Stack spacing={1}>
                  <Typography><strong>氏名:</strong> {selected.name}</Typography>
                  <Typography><strong>メール:</strong> {selected.email}</Typography>
                  <Typography><strong>電話:</strong> {selected.phone || '未登録'}</Typography>
                  <Typography><strong>入社日:</strong> {formatDate(selected.joinDate)}</Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>部署・役職</Typography>
                <Stack spacing={1}>
                  <Typography><strong>部署:</strong> {selected.department}</Typography>
                  <Typography><strong>役職:</strong> {selected.position}</Typography>
                  <Typography><strong>ステータス:</strong> <Chip label={selected.isActive ? '在籍' : '退職'} color={selected.isActive ? 'success' : 'default'} size="small" sx={{ ml: 1 }} /></Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>スキル</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selected.skills.length > 0 ? selected.skills.map((s) => <Chip key={s} label={s} variant="outlined" />) : <Typography color="text.secondary">スキル情報なし</Typography>}
                </Box>
              </Box>
              {selected.notes && (
                <Box>
                  <Typography variant="h6" gutterBottom>備考</Typography>
                  <Typography sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 1, whiteSpace: 'pre-wrap' }}>{selected.notes}</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="h6" gutterBottom>その他情報</Typography>
                <Stack spacing={1}>
                  <Typography><strong>登録日:</strong> {formatDate(selected.createdAt)}</Typography>
                  <Typography><strong>更新日:</strong> {formatDate(selected.updatedAt)}</Typography>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onCloseDetail} variant="outlined">閉じる</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
    <Dialog open={deleteOpen} onClose={onCancelDelete} PaperProps={{ sx: { borderRadius: 2, background: 'linear-gradient(135deg,#ffebee 0%,#ffcdd2 100%)' } }}>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>社員削除の確認</DialogTitle>
      <DialogContent>
        <Typography>本当に「{deleting?.name}」を削除しますか？</Typography>
        <Typography color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>この操作は取り消せません。</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelDelete} variant="outlined">キャンセル</Button>
        <Button onClick={onConfirmDelete} variant="contained" color="error">削除</Button>
      </DialogActions>
    </Dialog>
  </>
);

export default EmployeeDialogs;
