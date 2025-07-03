import React from 'react';
import { TextFieldProps as MuiTextFieldProps } from '@mui/material';

// 統一されたTextField のサイズオプション
export type TextFieldSize = 'small' | 'medium';

// 統一されたTextField のバリアント
export type TextFieldVariant = 'outlined' | 'filled' | 'standard';

// StandardTextField用の型定義
export interface StandardTextFieldProps extends Omit<MuiTextFieldProps, 'size' | 'variant'> {
  /** テキストフィールドのサイズ */
  size?: TextFieldSize;
  /** テキストフィールドのバリアント */
  variant?: TextFieldVariant;
  /** 検証エラーメッセージ */
  errorMessage?: string;
  /** 成功状態 */
  success?: boolean;
  /** 必須フィールドマーク */
  required?: boolean;
  /** ヘルプテキスト */
  helperText?: React.ReactNode;
  /** 文字数カウンター表示 */
  showCharacterCount?: boolean;
  /** 最大文字数 */
  maxLength?: number;
  /** クリアボタン表示 */
  clearable?: boolean;
  /** クリア時のコールバック */
  onClear?: () => void;
}
