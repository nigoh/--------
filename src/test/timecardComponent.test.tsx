import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import { createModernTheme } from '../theme/modernTheme';
import Timecard from '../features/timecard/Timecard';

const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = createModernTheme({ mode: 'light', highContrast: false, fontSize: 'medium' });
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeProvider>
  );
};

describe('Timecard component', () => {
  it('renders heading', () => {
    const { getByText } = render(
      <TestProvider>
        <Timecard />
      </TestProvider>
    );
    expect(getByText('タイムカード管理')).toBeInTheDocument();
  });
});
