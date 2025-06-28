import React from 'react';
import { Box, Typography } from '@mui/material';

interface MeetingFlowProps {
  onBack: (updatedTeams?: string[][]) => void;
  teams: string[][];
  setTeams: (teams: string[][]) => void;
  members: string[];
}

const MeetingFlow: React.FC<MeetingFlowProps> = ({ onBack, teams, setTeams, members }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">MeetingFlow テスト</Typography>
      <Typography variant="body1">
        このコンポーネントは正常に動作しています。
      </Typography>
      <Typography variant="body2">
        Teams: {teams.length}チーム
      </Typography>
      <Typography variant="body2">
        Members: {members.length}人
      </Typography>
    </Box>
  );
};

export default MeetingFlow;
