import React from 'react';
import { Box } from '@mui/material';

/**
 * Tab Panel Component
 * タブコンテンツの表示/非表示を制御するコンポーネント
 * アクセシビリティに配慮したタブパネルの実装
 */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`main-tabpanel-${index}`}
      aria-labelledby={`main-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export default TabPanel;
