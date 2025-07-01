import React from 'react';
import {
  TextField,
  Stack,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import { FormDialog, FormDialogContent, FormDialogSection } from '../../../components/ui';

export interface EditForm {
  date: string;
  startTime: string;
  endTime: string;
  breakTime: string;
  overtime: string;
  isHoliday: boolean;
  workType: string;
}

interface Props {
  open: boolean;
  form: EditForm;
  onChange: (field: keyof EditForm, value: any) => void;
  onClose: () => void;
  onSave: () => void;
}

const TimecardEditDialog: React.FC<Props> = ({ 
  open, 
  form, 
  onChange, 
  onClose, 
  onSave 
}) => {
  const isValid = form.date !== '' && form.startTime !== '' && form.endTime !== '';

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSave}
      title="勤怠編集"
      size="sm"
      isValid={isValid}
      submitText="保存"
    >
      <FormDialogContent>
        <FormDialogSection title="勤務情報">
          <Stack spacing={2}>
            <TextField
              label="日付"
              type="date"
              value={form.date}
              onChange={(e) => onChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            
            <TextField
              label="開始時刻"
              type="time"
              value={form.startTime}
              onChange={(e) => onChange('startTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            
            <TextField
              label="終了時刻"
              type="time"
              value={form.endTime}
              onChange={(e) => onChange('endTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            
            <TextField
              label="休憩時間（分）"
              type="number"
              value={form.breakTime}
              onChange={(e) => onChange('breakTime', e.target.value)}
              size="small"
              fullWidth
            />
            
            <TextField
              label="残業時間（分）"
              type="number"
              value={form.overtime}
              onChange={(e) => onChange('overtime', e.target.value)}
              size="small"
              fullWidth
            />
          </Stack>
        </FormDialogSection>

        <FormDialogSection title="勤務設定">
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isHoliday}
                  onChange={(e) => onChange('isHoliday', e.target.checked)}
                />
              }
              label="休日出勤"
            />
            
            <FormControl component="fieldset">
              <FormLabel component="legend">勤務形態</FormLabel>
              <RadioGroup
                value={form.workType}
                onChange={(e) => onChange('workType', e.target.value)}
              >
                <FormControlLabel value="通常" control={<Radio />} label="通常勤務" />
                <FormControlLabel value="在宅" control={<Radio />} label="在宅勤務" />
                <FormControlLabel value="出張" control={<Radio />} label="出張" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </FormDialogSection>
      </FormDialogContent>
    </FormDialog>
  );
};

export default TimecardEditDialog;
