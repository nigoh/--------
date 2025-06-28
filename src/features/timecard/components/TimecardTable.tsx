import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TimecardEntry } from '../useTimecardStore';

interface Props {
  entries: TimecardEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TimecardTable: React.FC<Props> = ({ entries, onEdit, onDelete }) => (
  <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
          <TableCell>日付</TableCell>
          <TableCell>出勤</TableCell>
          <TableCell>退勤</TableCell>
          <TableCell>備考</TableCell>
          <TableCell align="center">操作</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {entries.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{e.date}</TableCell>
            <TableCell>{e.isAbsence ? '-' : e.startTime}</TableCell>
            <TableCell>{e.isAbsence ? '-' : e.endTime}</TableCell>
            <TableCell>{e.isAbsence ? `${e.absenceReason ?? ''} (${e.absenceType === 'planned' ? '計画' : '突発'})` : e.note}</TableCell>
            <TableCell align="center">
              <IconButton size="small" color="primary" onClick={() => onEdit(e.id)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(e.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default TimecardTable;
