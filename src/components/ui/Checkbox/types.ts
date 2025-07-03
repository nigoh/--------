import { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import { FormControlLabelProps } from '@mui/material/FormControlLabel';

// チェックボックスのサイズ
export type CheckboxSize = 'small' | 'medium' | 'large';

// チェックボックスの状態
export type CheckboxState = 'default' | 'error' | 'disabled';

// チェックボックスのバリアント
export type CheckboxVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

// チェックボックスオプション（グループ用）
export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

// StandardCheckbox のプロパティ
export interface StandardCheckboxProps extends Omit<MuiCheckboxProps, 'size' | 'color' | 'onFocus' | 'onBlur'> {
  // 基本プロパティ
  label?: string;
  helperText?: string;
  errorText?: string;
  
  // サイズとバリアント
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  state?: CheckboxState;
  
  // レイアウト
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  fullWidth?: boolean;
  
  // 高度な機能
  indeterminate?: boolean;
  required?: boolean;
  
  // フォーム統合
  name?: string;
  value?: string;
  
  // イベントハンドラー
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  // アクセシビリティ
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

// CheckboxGroup のプロパティ
export interface CheckboxGroupProps {
  // 基本プロパティ
  name: string;
  options: CheckboxOption[];
  value?: string[];
  defaultValue?: string[];
  
  // レイアウト
  direction?: 'row' | 'column';
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  
  // 状態
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  
  // テキスト
  label?: string;
  helperText?: string;
  errorText?: string;
  
  // イベントハンドラー
  onChange?: (value: string[]) => void;
  
  // アクセシビリティ
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
