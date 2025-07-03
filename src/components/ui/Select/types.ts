import { SelectProps as MuiSelectProps, SelectChangeEvent, FormControlProps, InputLabelProps, FormHelperTextProps } from '@mui/material';
import { ReactNode } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface StandardSelectProps extends Omit<MuiSelectProps, 'onChange' | 'variant' | 'renderValue'> {
  /** Select options array or children */
  options?: SelectOption[];
  /** Controlled value */
  value?: string | number | string[] | number[];
  /** Default value for uncontrolled mode */
  defaultValue?: string | number | string[] | number[];
  /** Change handler */
  onChange?: (value: string | number | string[] | number[], event: SelectChangeEvent) => void;
  /** Label text */
  label?: string;
  /** Helper text below the select */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Multiple selection mode */
  multiple?: boolean;
  /** Display empty option */
  displayEmpty?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Size variant */
  size?: 'small' | 'medium';
  /** Visual variant */
  variant?: 'outlined' | 'filled' | 'standard';
  /** Full width */
  fullWidth?: boolean;
  /** Auto width */
  autoWidth?: boolean;
  /** Native HTML select */
  native?: boolean;
  /** Custom render for selected values in multiple mode */
  renderValue?: (selected: string[] | number[]) => ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Success state */
  success?: boolean;
  /** Group options by property */
  groupBy?: string;
  /** Show search/filter input */
  searchable?: boolean;
  /** No options text */
  noOptionsText?: string;
  /** Clear button */
  clearable?: boolean;
  /** Form control props */
  FormControlProps?: Partial<FormControlProps>;
  /** Input label props */
  InputLabelProps?: Partial<InputLabelProps>;
  /** Helper text props */
  FormHelperTextProps?: Partial<FormHelperTextProps>;
}

export type SelectSize = NonNullable<StandardSelectProps['size']>;
export type SelectVariant = NonNullable<StandardSelectProps['variant']>;
