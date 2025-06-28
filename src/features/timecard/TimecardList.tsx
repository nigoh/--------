import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { useTimecardStore } from './useTimecardStore';
import TimecardTable from './components/TimecardTable';
import TimecardEditDialog, { EditForm } from './components/TimecardEditDialog';


export const TimecardList: React.FC = () => {
  const { entries, deleteEntry, updateEntry } = useTimecardStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({
    date: '',
    startTime: '',
    endTime: '',
    note: '',
    isAbsence: false,
    absenceReason: '',
    absenceType: 'planned',
  });

  const openEdit = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setForm({
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      note: entry.note,
      isAbsence: entry.isAbsence,
      absenceReason: entry.absenceReason ?? '',
      absenceType: entry.absenceType ?? 'planned',
    });
    setEditingId(id);
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateEntry(editingId, form);
    closeEdit();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        勤怠履歴
      </Typography>
      {entries.length === 0 ? (
        <Typography color="text.secondary">まだ登録がありません</Typography>
      ) : (
        <TimecardTable entries={entries} onEdit={openEdit} onDelete={deleteEntry} />
      )}
      <TimecardEditDialog
        open={!!editingId}
        form={form}
        onChange={setForm}
        onClose={closeEdit}
        onSave={handleSave}
      />
    </Paper>
  );
};
