/**
 * 現代的なグラデーション定義
 * ブランド一貫性とビジュアル階層を提供
 */

import { colorTokens } from './designSystem';

export const gradientTokens = {
  // Primary gradients - メインブランドカラー
  primary: {
    subtle: `linear-gradient(135deg, ${colorTokens.primary[95]} 0%, ${colorTokens.primary[90]} 100%)`,
    medium: `linear-gradient(135deg, ${colorTokens.primary[80]} 0%, ${colorTokens.primary[70]} 100%)`,
    bold: `linear-gradient(135deg, ${colorTokens.primary[60]} 0%, ${colorTokens.primary[50]} 100%)`,
    dark: `linear-gradient(135deg, ${colorTokens.primary[40]} 0%, ${colorTokens.primary[30]} 100%)`,
  },

  // Secondary gradients - 補助カラー
  secondary: {
    subtle: `linear-gradient(135deg, ${colorTokens.secondary[95]} 0%, ${colorTokens.secondary[90]} 100%)`,
    medium: `linear-gradient(135deg, ${colorTokens.secondary[80]} 0%, ${colorTokens.secondary[70]} 100%)`,
    bold: `linear-gradient(135deg, ${colorTokens.secondary[60]} 0%, ${colorTokens.secondary[50]} 100%)`,
  },

  // Tertiary gradients - アクセントカラー
  tertiary: {
    subtle: `linear-gradient(135deg, ${colorTokens.tertiary[95]} 0%, ${colorTokens.tertiary[90]} 100%)`,
    medium: `linear-gradient(135deg, ${colorTokens.tertiary[80]} 0%, ${colorTokens.tertiary[70]} 100%)`,
    bold: `linear-gradient(135deg, ${colorTokens.tertiary[60]} 0%, ${colorTokens.tertiary[50]} 100%)`,
  },

  // Background gradients - 背景用
  background: {
    light: `linear-gradient(135deg, ${colorTokens.neutral[99]} 0%, ${colorTokens.neutral[95]} 100%)`,
    lightSubtle: `linear-gradient(135deg, ${colorTokens.neutral[99]} 0%, ${colorTokens.neutralVariant[95]} 100%)`,
    dark: `linear-gradient(135deg, ${colorTokens.neutral[10]} 0%, ${colorTokens.neutral[20]} 100%)`,
    darkSubtle: `linear-gradient(135deg, ${colorTokens.neutral[20]} 0%, ${colorTokens.neutralVariant[20]} 100%)`,
  },

  // Surface gradients - カード・パネル用
  surface: {
    light: `linear-gradient(135deg, ${colorTokens.neutral[100]} 0%, ${colorTokens.neutral[99]} 100%)`,
    lightElevated: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
    dark: `linear-gradient(135deg, ${colorTokens.neutral[20]} 0%, ${colorTokens.neutral[30]} 100%)`,
    darkElevated: `linear-gradient(135deg, rgba(45, 45, 47, 0.9) 0%, rgba(45, 45, 47, 0.7) 100%)`,
  },

  // Semantic gradients - 意味を持つカラー
  semantic: {
    success: `linear-gradient(135deg, ${colorTokens.success[80]} 0%, ${colorTokens.success[70]} 100%)`,
    warning: `linear-gradient(135deg, ${colorTokens.warning[80]} 0%, ${colorTokens.warning[70]} 100%)`,
    error: `linear-gradient(135deg, ${colorTokens.error[80]} 0%, ${colorTokens.error[70]} 100%)`,
  },

  // Interactive gradients - インタラクション用
  interactive: {
    hover: `linear-gradient(135deg, ${colorTokens.primary[90]} 0%, ${colorTokens.secondary[90]} 100%)`,
    pressed: `linear-gradient(135deg, ${colorTokens.primary[80]} 0%, ${colorTokens.secondary[80]} 100%)`,
    focus: `linear-gradient(135deg, ${colorTokens.primary[85]} 0%, ${colorTokens.tertiary[85]} 100%)`,
  },

  // Glass morphism gradients - ガラス効果
  glass: {
    light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
    lightBorder: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
    dark: 'linear-gradient(135deg, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.4) 100%)',
    darkBorder: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  },

  // Directional gradients - 方向性のあるグラデーション
  directional: {
    topToBottom: (color1: string, color2: string) => `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`,
    leftToRight: (color1: string, color2: string) => `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`,
    diagonal: (color1: string, color2: string) => `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    radial: (color1: string, color2: string) => `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`,
  },

  // Theme-aware gradients helper
  themeAware: {
    background: (isDark: boolean) => 
      isDark ? gradientTokens.background.dark : gradientTokens.background.light,
    surface: (isDark: boolean) => 
      isDark ? gradientTokens.surface.dark : gradientTokens.surface.light,
    surfaceElevated: (isDark: boolean) => 
      isDark ? gradientTokens.surface.darkElevated : gradientTokens.surface.lightElevated,
    glass: (isDark: boolean) => 
      isDark ? gradientTokens.glass.dark : gradientTokens.glass.light,
    glassBorder: (isDark: boolean) => 
      isDark ? gradientTokens.glass.darkBorder : gradientTokens.glass.lightBorder,
  },
};

// Utility functions for creating custom gradients
export const createGradient = {
  linear: (degree: number, color1: string, color2: string, ...additionalColors: string[]) =>
    `linear-gradient(${degree}deg, ${[color1, color2, ...additionalColors].join(', ')})`,
  
  radial: (color1: string, color2: string, shape: 'circle' | 'ellipse' = 'circle') =>
    `radial-gradient(${shape}, ${color1} 0%, ${color2} 100%)`,
  
  conic: (degree: number, color1: string, color2: string) =>
    `conic-gradient(from ${degree}deg, ${color1} 0%, ${color2} 100%)`,
  
  mesh: (colors: string[]) => {
    const positions = [
      'at 0% 0%',
      'at 100% 0%', 
      'at 100% 100%',
      'at 0% 100%'
    ];
    
    return colors.map((color, index) => 
      `radial-gradient(${positions[index] || 'at 50% 50%'}, ${color} 0%, transparent 50%)`
    ).join(', ');
  },
};

export default gradientTokens;
