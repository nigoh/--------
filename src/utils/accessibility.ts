/**
 * アクセシビリティ関連のユーティリティ関数
 */

// prefers-reduced-motionを考慮したアニメーション設定
export const getReducedMotionStyles = () => {
  return {
    '@media (prefers-reduced-motion: reduce)': {
      '*': {
        animationDuration: '0.01ms !important',
        animationIterationCount: '1 !important',
        transitionDuration: '0.01ms !important',
        scrollBehavior: 'auto !important',
      },
    },
  };
};

// アニメーション時間を動的に調整
export const getAnimationDuration = (normalDuration: string, reducedDuration = '0.01ms') => {
  return {
    animationDuration: normalDuration,
    '@media (prefers-reduced-motion: reduce)': {
      animationDuration: reducedDuration,
    },
  };
};

// フォーカス管理のユーティリティ
export const focusStyles = {
  outline: '2px solid transparent',
  outlineOffset: '2px',
  '&:focus-visible': {
    outline: '2px solid #667eea',
    outlineOffset: '2px',
    boxShadow: '0 0 0 2px rgba(103, 126, 234, 0.2)',
  },
};

// スクリーンリーダー用のスタイル
export const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

// ハイコントラストモード対応
export const highContrastStyles = {
  '@media (prefers-contrast: high)': {
    border: '1px solid',
    backgroundColor: 'ButtonFace',
    color: 'ButtonText',
  },
};
