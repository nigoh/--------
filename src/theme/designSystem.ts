/**
 * Material Design 3 Design System
 * 
 * Material Design 3の仕様に基づいたデザイントークンとカラーシステム
 * https://m3.material.io/
 */

// ==================== Color System ====================

export const colorTokens = {
  // Primary Brand Color
  primary: {
    0: '#000000',
    10: '#21005D',
    20: '#381E72',
    30: '#4F378B',
    40: '#6750A4',
    50: '#7F67BE',
    60: '#9A82DB',
    70: '#B69DF8',
    80: '#D0BCFF',
    90: '#EADDFF',
    95: '#F6EDFF',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  // Secondary Color
  secondary: {
    0: '#000000',
    10: '#1D192B',
    20: '#332D41',
    30: '#4A4458',
    40: '#625B71',
    50: '#7A7289',
    60: '#958DA5',
    70: '#B0A7C0',
    80: '#CCC2DC',
    90: '#E8DEF8',
    95: '#F6EDFF',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  // Tertiary Color
  tertiary: {
    0: '#000000',
    10: '#31111D',
    20: '#492532',
    30: '#633B48',
    40: '#7D5260',
    50: '#986977',
    60: '#B58392',
    70: '#D29DAC',
    80: '#EFB8C8',
    90: '#FFD8E4',
    95: '#FFECF1',
    99: '#FFFBFA',
    100: '#FFFFFF',
  },
  
  // Error Color
  error: {
    0: '#000000',
    10: '#410E0B',
    20: '#601410',
    30: '#8C1D18',
    40: '#B3261E',
    50: '#DC362E',
    60: '#E46962',
    70: '#EC928E',
    80: '#F2B8B5',
    90: '#F9DEDC',
    95: '#FCEEEE',
    99: '#FFFBF9',
    100: '#FFFFFF',
  },
  
  // Neutral Color
  neutral: {
    0: '#000000',
    10: '#1C1B1F',
    20: '#313033',
    30: '#484649',
    40: '#605D62',
    50: '#787579',
    60: '#939094',
    70: '#AEAAAE',
    80: '#CAC4D0',
    90: '#E6E0E9',
    95: '#F4EFF4',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  // Neutral Variant
  neutralVariant: {
    0: '#000000',
    10: '#1D1A22',
    20: '#322F37',
    30: '#49454F',
    40: '#605D66',
    50: '#787579',
    60: '#938F99',
    70: '#AEA9B4',
    80: '#CAC4D0',
    90: '#E7E0EC',
    95: '#F5EEFA',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
};

// ==================== Typography Scale ====================

export const typographyTokens = {
  // Display styles - 大きな見出し
  displayLarge: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '57px',
    fontWeight: 400,
    lineHeight: '64px',
    letterSpacing: '-0.25px',
  },
  displayMedium: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '45px',
    fontWeight: 400,
    lineHeight: '52px',
    letterSpacing: '0px',
  },
  displaySmall: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '36px',
    fontWeight: 400,
    lineHeight: '44px',
    letterSpacing: '0px',
  },
  
  // Headline styles - セクション見出し
  headlineLarge: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '32px',
    fontWeight: 400,
    lineHeight: '40px',
    letterSpacing: '0px',
  },
  headlineMedium: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '28px',
    fontWeight: 400,
    lineHeight: '36px',
    letterSpacing: '0px',
  },
  headlineSmall: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: '32px',
    letterSpacing: '0px',
  },
  
  // Title styles - タイトル・小見出し
  titleLarge: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '22px',
    fontWeight: 400,
    lineHeight: '28px',
    letterSpacing: '0px',
  },
  titleMedium: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0.15px',
  },
  titleSmall: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },
  
  // Body styles - 本文テキスト
  bodyLarge: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.5px',
  },
  bodyMedium: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0.25px',
  },
  bodySmall: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0.4px',
  },
  
  // Label styles - ボタン・ラベル
  labelLarge: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },
  labelMedium: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '0.5px',
  },
  labelSmall: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '0.5px',
  },
};

// ==================== Shape System ====================

export const shapeTokens = {
  corner: {
    none: '0px',
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '50%',
  },
};

// ==================== Elevation System ====================

export const elevationTokens = {
  level0: {
    boxShadow: 'none',
  },
  level1: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  },
  level2: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  },
  level3: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
  },
  level4: {
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
  },
  level5: {
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
  },
};

// ==================== Spacing System ====================

/**
 * 4pt グリッドシステム（ワークアプリ向けコンパクト設計）
 * 全ての余白・要素サイズを4pxの倍数に統一
 * ビジネスアプリケーションに適した密度の高いレイアウト
 */
export const spacingTokens = {
  none: 0,
  xs: 2,     // 0.5 * 4
  sm: 4,     // 1 * 4
  md: 8,     // 2 * 4
  lg: 12,    // 3 * 4
  xl: 16,    // 4 * 4
  xxl: 20,   // 5 * 4
  xxxl: 24,  // 6 * 4
  xxxxl: 32, // 8 * 4
};

// ==================== Motion System ====================

/**
 * Material Design 3 モーションシステム
 */
export const motionTokens = {
  duration: {
    short1: '50ms',
    short2: '100ms',
    short3: '150ms',
    short4: '200ms',
    medium1: '250ms',
    medium2: '300ms',
    medium3: '350ms',
    medium4: '400ms',
    long1: '450ms',
    long2: '500ms',
    long3: '550ms',
    long4: '600ms',
  },
  
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    decelerated: 'cubic-bezier(0, 0, 0, 1)',
    accelerated: 'cubic-bezier(0.3, 0, 1, 1)',
  },
};

// ==================== Component State Layers ====================

/**
 * MD3 State Layer システム
 * インタラクション状態の透明度定義
 */
export const stateLayerTokens = {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
  disabled: 0.38,
};

// ==================== Breakpoints ====================

/**
 * レスポンシブデザイン用ブレークポイント
 */
export const breakpointTokens = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};
