import { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';

// スイッチのサイズ
export type SwitchSize = 'small' | 'medium' | 'large';

// スイッチの状態
export type SwitchState = 'default' | 'error' | 'disabled';

// スイッチのバリアント
export type SwitchVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

// StandardSwitch のプロパティ
export interface StandardSwitchProps extends Omit<MuiSwitchProps, 'size' | 'color'> {
  // 基本プロパティ
  label?: string;
  helperText?: string;
  errorText?: string;
  
  // サイズとバリアント
  size?: SwitchSize;
  variant?: SwitchVariant;
  state?: SwitchState;
  
  // レイアウト
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  fullWidth?: boolean;
  
  // 高度な機能
  required?: boolean;
  
  // ラベル
  onLabel?: string;
  offLabel?: string;
  
  // フォーム統合
  name?: string;
  value?: string;
  
  // イベントハンドラー
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  
  // アクセシビリティ
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}
