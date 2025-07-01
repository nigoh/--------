/**
 * IME（日本語入力）スタイル設定
 * 予測変換時の青い背景色を通常の入力と同じ配色に統一
 */
import { Theme } from '@mui/material/styles';

/**
 * IME入力時のスタイルを通常の入力と同じにするCSSルール
 */
export const getIMEStyles = (theme: Theme) => ({
  '& input': {
    // IME変換中の文字列スタイル（Chrome, Edge）
    '&::-webkit-input-placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.6,
    },
    
    // IME変換中のテキスト背景色を透明に
    '&:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
      WebkitTextFillColor: theme.palette.text.primary,
      transition: 'background-color 5000s ease-in-out 0s',
    },
    
    // Firefox用のIMEスタイル
    '&::-moz-placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.6,
    },
    
    // IE/Edge用のIMEスタイル  
    '&:-ms-input-placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.6,
    },
  },
  
  // TextAreaの場合
  '& textarea': {
    '&::-webkit-input-placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.6,
    },
    '&::-moz-placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.6,
    },
    '&:-ms-input-placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.6,
    },
  },
});

/**
 * グローバルIMEスタイル（CSSBaseline用）
 */
export const globalIMEStyles = (theme: Theme) => ({
  // すべてのinput要素に適用
  'input, textarea': {
    // IME変換中の青い背景を無効化
    '&::selection': {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
    
    // Chrome/Safari用のIME変換中スタイル
    '&:focus': {
      '&::selection': {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.text.primary,
      },
    },
  },
  
  // MUI TextField特有のスタイル
  '.MuiInputBase-input': {
    // IME変換中の文字色を通常と同じに
    '&::selection': {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
    
    // フォーカス時のIME変換スタイル
    '&:focus': {
      '&::selection': {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.text.primary,
      },
    },
  },
  
  // Outlined TextField
  '.MuiOutlinedInput-input': {
    '&::selection': {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
  },
  
  // Filled TextField
  '.MuiFilledInput-input': {
    '&::selection': {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
  },
  
  // Standard TextField
  '.MuiInput-input': {
    '&::selection': {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
  },
});

/**
 * 日本語入力専用のスタイル修正
 * IME変換中の青い背景色を除去
 */
export const japaneseInputStyles = (theme: Theme) => ({
  // ブラウザ固有のIME変換スタイルをリセット
  '& input, & textarea': {
    // Chrome/Edge - IME変換中の青い背景を無効化
    '&[inputmode]': {
      backgroundColor: 'transparent !important',
      color: `${theme.palette.text.primary} !important`,
    },
    
    // Safari - IME変換中のスタイル
    '&:-webkit-any(input)': {
      backgroundColor: 'transparent !important',
      color: `${theme.palette.text.primary} !important`,
    },
    
    // Firefox - IME変換中のスタイル
    '&:-moz-any(input, textarea)': {
      backgroundColor: 'transparent !important',
      color: `${theme.palette.text.primary} !important`,
    },
  },
  
  // 変換候補の表示スタイル
  '& .MuiInputBase-root': {
    '& input': {
      // IME変換中も通常のテキスト色を維持
      '&:focus': {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
      },
    },
  },
});

/**
 * MUIテーマに組み込むIMEスタイル
 */
export const createIMEThemeOverrides = (theme: Theme) => ({
  MuiInputBase: {
    styleOverrides: {
      input: {
        // IME変換中の選択範囲スタイル
        '&::selection': {
          backgroundColor: theme.palette.action.selected,
          color: theme.palette.text.primary,
        },
        
        // IME変換中の背景色を透明に
        '&:focus': {
          backgroundColor: 'transparent',
          '&::selection': {
            backgroundColor: theme.palette.action.selected,
            color: theme.palette.text.primary,
          },
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        // TextField全体のIMEスタイル
        ...getIMEStyles(theme),
      },
    },
  },
});
