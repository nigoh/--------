import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { TimecardForm } from './TimecardForm';
import { TimecardList } from './TimecardList';
import TimecardSummary from './TimecardSummary';

const Timecard: React.FC = () => {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const headerActions = (
    <TextField
      type="month"
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      size="small"
      sx={{ 
        minWidth: 150,
        '& .MuiInputBase-root': {
          borderRadius: 2,
        }
      }}
    />
  );

  return (
    <FeatureLayout maxWidth={false}>
      <FeatureHeader
        title="勤怠管理"
        subtitle="出勤・退勤の記録と勤怠履歴の確認ができます。月別の集計も表示されます。"
        actions={headerActions}
        showAddButton={false}
      />
      
      <FeatureContent variant="transparent" padding={0}>
        <Stack spacing={3} sx={{ p: 2 }}>
          {/* 勤怠登録フォーム */}
          <TimecardForm />

          {/* 勤怠サマリー */}
          <TimecardSummary month={month} />

          {/* 勤怠履歴リスト */}
          <TimecardList />
        </Stack>
      </FeatureContent>
    </FeatureLayout>
  );
};

export default Timecard;
