/**
 * Material Design 3 Design System
 * 
 * Material Design 3の仕様に基づいたデザイントークンとカラーシステム
 * https://m3.material.io/
 */

// ==================== Color System ====================

export const colorTokens = {
  // Primary Brand Color - より洗練されたパープル
  primary: {
    0: '#000000',
    10: '#1A0A2B',
    20: '#2D1B3D',
    30: '#3F2C4F',
    40: '#5B4B6B',
    50: '#7263A7',
    60: '#8A7BC8',
    70: '#A394DA',
    80: '#C5B8F0',
    90: '#E8DDF9',
    95: '#F5F1FC',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  // Secondary Color - 温かみのあるスレート
  secondary: {
    0: '#000000',
    10: '#171B2C',
    20: '#2C3042',
    30: '#42465A',
    40: '#5A5E72',
    50: '#72768A',
    60: '#8C90A5',
    70: '#A7ABC0',
    80: '#C3C6DC',
    90: '#DFE2F8',
    95: '#F0F1FC',
    99: '#FFFBFE',
    100: '#FFFFFF',
  },
  
  // Tertiary Color - アクセントとしてのティール
  tertiary: {
    0: '#000000',
    10: '#002021',
    20: '#003738',
    30: '#004F50',
    40: '#006769',
    50: '#008084',
    60: '#2B9B9F',
    70: '#4FB6BB',
    80: '#73D2D7',
    90: '#9FEFF4',
    95: '#C7F7FC',
    99: '#F0FEFF',
    100: '#FFFFFF',
  },
  
  // Error Color - より穏やかなレッド
  error: {
    0: '#000000',
    10: '#370B0B',
    20: '#531414',
    30: '#702020',
    40: '#8E2E2E',
    50: '#B73E3E',
    60: '#D85858',
    70: '#E97777',
    80: '#F49797',
    90: '#FBBDBD',
    95: '#FDDDDD',
    99: '#FFF8F8',
    100: '#FFFFFF',
  },
  
  // Success Color - 自然なグリーン
  success: {
    0: '#000000',
    10: '#002204',
    20: '#0A360F',
    30: '#1A4B1F',
    40: '#2B6030',
    50: '#3D7542',
    60: '#4F8B55',
    70: '#62A169',
    80: '#76B77D',
    90: '#8BCC92',
    95: '#C8F0CB',
    99: '#F5FFF6',
    100: '#FFFFFF',
  },
  
  // Warning Color - エネルギッシュなアンバー
  warning: {
    0: '#000000',
    10: '#2D1A00',
    20: '#442B00',
    30: '#5C3C00',
    40: '#754E00',
    50: '#8F6000',
    60: '#AA7300',
    70: '#C68600',
    80: '#E39A00',
    90: '#FFAF2B',
    95: '#FFD695',
    99: '#FFF8F0',
    100: '#FFFFFF',
  },
  
  // Neutral Color - 温かみのあるグレー
  neutral: {
    0: '#000000',
    10: '#1A1A1C',
    20: '#2F2F31',
    30: '#454547',
    40: '#5C5C5F',
    50: '#747477',
    60: '#8E8E91',
    70: '#A8A8AB',
    80: '#C3C3C6',
    90: '#DFE0E2',
    95: '#F0F0F2',
    99: '#FCFCFC',
    100: '#FFFFFF',
  },
  
  // Neutral Variant - わずかに彩度のあるグレー
  neutralVariant: {
    0: '#000000',
    10: '#1B1A22',
    20: '#302F37',
    30: '#46454F',
    40: '#5E5C66',
    50: '#76747F',
    60: '#908E99',
    70: '#ABA9B4',
    80: '#C7C4D0',
    90: '#E3E0EC',
    95: '#F2EFFA',
    99: '#FCFCFC',
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
