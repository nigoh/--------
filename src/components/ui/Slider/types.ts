import { SliderProps as MuiSliderProps } from '@mui/material/Slider';

// スライダーのサイズ
export type SliderSize = 'small' | 'medium' | 'large';

// スライダーの状態
export type SliderState = 'default' | 'error' | 'disabled';

// スライダーのバリアント
export type SliderVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

// スライダーのマーク
export interface SliderMark {
  value: number;
  label?: string;
}

// StandardSlider のプロパティ
export interface StandardSliderProps extends Omit<MuiSliderProps, 'size' | 'color'> {
  // 基本プロパティ
  label?: string;
  helperText?: string;
  errorText?: string;
  
  // サイズとバリアント
  size?: SliderSize;
  variant?: SliderVariant;
  state?: SliderState;
  
  // レイアウト
  fullWidth?: boolean;
  
  // 値の表示
  showValue?: boolean;
  valueFormat?: (value: number) => string;
  
  // 範囲
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean | SliderMark[];
  
  // 高度な機能
  required?: boolean;
  discrete?: boolean;
  
  // フォーム統合
  name?: string;
  
  // イベントハンドラー
  onChange?: (event: Event, value: number | number[]) => void;
  onChangeCommitted?: (event: React.SyntheticEvent | Event, value: number | number[]) => void;
  
  // アクセシビリティ
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}
