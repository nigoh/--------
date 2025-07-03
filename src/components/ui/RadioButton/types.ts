import { RadioProps as MuiRadioProps } from '@mui/material/Radio';
import { FormControlLabelProps } from '@mui/material/FormControlLabel';

// ラジオボタンのサイズ
export type RadioSize = 'small' | 'medium' | 'large';

// ラジオボタンの状態
export type RadioState = 'default' | 'error' | 'disabled';

// ラジオボタンのバリアント
export type RadioVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

// ラジオボタンオプション（グループ用）
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

// StandardRadio のプロパティ
export interface StandardRadioProps extends Omit<MuiRadioProps, 'size' | 'color' | 'onChange'> {
  // 基本プロパティ
  label?: string;
  helperText?: string;
  errorText?: string;
  
  // サイズとバリアント
  size?: RadioSize;
  variant?: RadioVariant;
  state?: RadioState;
  
  // レイアウト
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  fullWidth?: boolean;
  
  // 高度な機能
  required?: boolean;
  
  // フォーム統合
  name?: string;
  value?: string;
  
  // イベントハンドラー
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  
  // アクセシビリティ
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

// RadioGroup のプロパティ
export interface RadioGroupProps {
  // 基本プロパティ
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  
  // レイアウト
  direction?: 'row' | 'column';
  size?: RadioSize;
  variant?: RadioVariant;
  
  // 状態
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  
  // テキスト
  label?: string;
  helperText?: string;
  errorText?: string;
  
  // イベントハンドラー
  onChange?: (value: string) => void;
  
  // アクセシビリティ
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
