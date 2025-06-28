import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Button, Checkbox, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material';

export interface EditForm {
  date: string;
  startTime: string;
  endTime?: string;
  note?: string;
  isAbsence: boolean;
  absenceReason?: string;
  absenceType?: 'planned' | 'sudden';
}

interface Props {
  open: boolean;
  form: EditForm;
  onChange: (f: EditForm) => void;
  onClose: () => void;
  onSave: () => void;
}

const TimecardEditDialog: React.FC<Props> = ({ open, form, onChange, onClose, onSave }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ fontWeight: 'bold' }}>勤怠編集</DialogTitle>
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField label="日付" type="date" value={form.date} onChange={(e) => onChange({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
        <FormControlLabel control={<Checkbox checked={form.isAbsence} onChange={(e) => onChange({ ...form, isAbsence: e.target.checked })} />} label="休暇" />
        <TextField label="出勤時間" type="time" value={form.startTime} onChange={(e) => onChange({ ...form, startTime: e.target.value })} InputLabelProps={{ shrink: true }} disabled={form.isAbsence} />
        <TextField label="退勤時間" type="time" value={form.endTime} onChange={(e) => onChange({ ...form, endTime: e.target.value })} InputLabelProps={{ shrink: true }} disabled={form.isAbsence} />
        {form.isAbsence && (
          <>
            <TextField label="理由" value={form.absenceReason} onChange={(e) => onChange({ ...form, absenceReason: e.target.value })} />
            <FormControl>
              <FormLabel>種別</FormLabel>
              <RadioGroup row value={form.absenceType} onChange={(e) => onChange({ ...form, absenceType: e.target.value as 'planned' | 'sudden' })}>
                <FormControlLabel value="planned" control={<Radio />} label="計画" />
                <FormControlLabel value="sudden" control={<Radio />} label="突発" />
              </RadioGroup>
            </FormControl>
          </>
        )}
        <TextField label="備考" value={form.note} onChange={(e) => onChange({ ...form, note: e.target.value })} multiline rows={2} />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined">キャンセル</Button>
      <Button onClick={onSave} variant="contained">保存</Button>
    </DialogActions>
  </Dialog>
);

export default TimecardEditDialog;
