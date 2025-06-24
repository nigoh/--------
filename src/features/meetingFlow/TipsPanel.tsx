import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

interface TipsPanelProps {
  tips: string[];
}

export default function TipsPanel({ tips }: TipsPanelProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>進行のコツ</Typography>
      <List dense>
        {tips.map((tip, i) => (
          <ListItem key={i}>
            <ListItemText primary={tip} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
