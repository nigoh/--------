import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CustomThemeProvider } from '../contexts/ThemeContext';
import { createModernTheme } from '../theme/modernTheme';
import Expense from '../features/expense/Expense';

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

describe('Expense component', () => {
  it('renders heading', () => {
    const { getByText } = render(
      <TestProvider>
        <Expense />
      </TestProvider>
    );
    expect(getByText('経費管理')).toBeInTheDocument();
  });
});
