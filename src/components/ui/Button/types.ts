import React from 'react';
import { ButtonProps as MuiButtonProps, IconButtonProps as MuiIconButtonProps, FabProps as MuiFabProps } from '@mui/material';

// 統一されたボタンのサイズオプション
export type ButtonSize = 'small' | 'medium' | 'large';

// 統一されたボタンのバリアント
export type ButtonVariant = 'contained' | 'outlined' | 'text';

// 統一されたカラーオプション
export type ButtonColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

// StandardButton用の型定義
export interface StandardButtonProps extends Omit<MuiButtonProps, 'size' | 'variant' | 'color'> {
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** ボタンのバリアント */
  variant?: ButtonVariant;
  /** ボタンのカラー */
  color?: ButtonColor;
  /** ローディング状態 */
  loading?: boolean;
  /** ローディング時のテキスト */
  loadingText?: string;
  /** フルワイドボタン */
  fullWidth?: boolean;
  /** アイコン（左側） */
  startIcon?: React.ReactNode;
  /** アイコン（右側） */
  endIcon?: React.ReactNode;
}

// IconButton用の型定義
export interface IconButtonProps extends Omit<MuiIconButtonProps, 'size' | 'color'> {
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** ボタンのカラー */
  color?: ButtonColor;
  /** ツールチップテキスト */
  tooltip?: string;
  /** ローディング状態 */
  loading?: boolean;
  /** バッジカウント */
  badgeCount?: number;
  /** バッジの最大表示数 */
  badgeMax?: number;
}

// FAB用の型定義  
export interface FABProps extends Omit<MuiFabProps, 'size' | 'color'> {
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** ボタンのカラー */
  color?: ButtonColor;
  /** ツールチップテキスト */
  tooltip?: string;
  /** 拡張FABのテキスト */
  label?: string;
  /** ローディング状態 */
  loading?: boolean;
}
