import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { useTimecardStore } from './useTimecardStore';
import { useTimecardForm } from './hooks/useTimecardForm';
import TimecardTable from './components/TimecardTable';
import TimecardEditDialog, { EditForm } from './components/TimecardEditDialog';


export const TimecardList: React.FC = () => {
  const { entries } = useTimecardStore();
  const { handleUpdateTimecard, handleDeleteTimecard } = useTimecardForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({
    date: '',
    startTime: '',
    endTime: '',
    breakTime: '',
    overtime: '',
    isHoliday: false,
    workType: 'normal',
  });

  const openEdit = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setForm({
      date: entry.date,
      startTime: entry.startTime || '',
      endTime: entry.endTime || '',
      breakTime: '',
      overtime: '',
      isHoliday: entry.isAbsence,
      workType: entry.isAbsence ? 'absence' : 'normal',
    });
    setEditingId(id);
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    // TimecardEntry型に変換
    const updateData = {
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      isAbsence: form.isHoliday,
      note: form.workType === 'absence' ? '休暇' : undefined
    };
    
    await handleUpdateTimecard(editingId, updateData);
    closeEdit();
  };

  const handleDelete = async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    
    await handleDeleteTimecard(entry);
  };

  const handleFormChange = (field: keyof EditForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        勤怠履歴
      </Typography>
      {entries.length === 0 ? (
        <Typography color="text.secondary">まだ登録がありません</Typography>
      ) : (
        <TimecardTable entries={entries} onEdit={openEdit} onDelete={handleDelete} />
      )}
      <TimecardEditDialog
        open={!!editingId}
        form={form}
        onChange={handleFormChange}
        onClose={closeEdit}
        onSave={handleSave}
      />
    </Paper>
  );
};
