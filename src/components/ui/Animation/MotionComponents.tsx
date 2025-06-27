/**
 * Framer Motion Animation Components
 * 
 * Material Design 3準拠のアニメーションコンポーネント
 * Reduced Motion対応、パフォーマンス最適化済み
 */

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Box } from '@mui/material';
import { motionTokens } from '../../../theme/designSystem';

// Easing関数を数値配列として定義
const easingFunctions = {
  standard: [0.2, 0, 0, 1],
  emphasized: [0.2, 0, 0, 1],
  decelerated: [0, 0, 0, 1],
  accelerated: [0.3, 0, 1, 1],
} as const;

// ==================== Base Motion Variants ====================

/**
 * フェードイン・アウト
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: parseFloat(motionTokens.duration.medium2) / 1000,
      ease: easingFunctions.standard,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: parseFloat(motionTokens.duration.medium1) / 1000,
      ease: easingFunctions.accelerated,
    },
  },
};

/**
 * スライドアップ
 */
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: parseFloat(motionTokens.duration.medium3) / 1000,
      ease: easingFunctions.emphasized,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: parseFloat(motionTokens.duration.medium2) / 1000,
      ease: easingFunctions.accelerated,
    },
  },
};

/**
 * スケールイン・アウト
 */
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: parseFloat(motionTokens.duration.medium2) / 1000,
      ease: easingFunctions.emphasized,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: parseFloat(motionTokens.duration.short4) / 1000,
      ease: easingFunctions.accelerated,
    },
  },
};

/**
 * ステージャードアニメーション（子要素を順次表示）
 */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * ステージャード子要素
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: parseFloat(motionTokens.duration.medium2) / 1000,
      ease: easingFunctions.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: parseFloat(motionTokens.duration.short4) / 1000,
      ease: easingFunctions.accelerated,
    },
  },
};

// ==================== Component Interfaces ====================

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sx?: any;
}

// ==================== Animation Components ====================

/**
 * フェードイン・アウトアニメーション
 */
export const FadeIn: React.FC<AnimationProps> = ({ children, ...props }) => {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * スライドアップアニメーション
 */
export const SlideUp: React.FC<AnimationProps> = ({ children, ...props }) => {
  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * スケールインアニメーション
 */
export const ScaleIn: React.FC<AnimationProps> = ({ children, ...props }) => {
  return (
    <motion.div
      variants={scaleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ステージャードアニメーション（コンテナ）
 */
export const StaggerContainer: React.FC<AnimationProps> = ({ children, ...props }) => {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ステージャードアニメーション（子要素）
 */
export const StaggerItem: React.FC<AnimationProps> = ({ children, ...props }) => {
  return (
    <motion.div
      variants={staggerItemVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ページトランジション
 */
interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'fade' | 'slide' | 'scale';
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  mode = 'fade' 
}) => {
  const getVariants = () => {
    switch (mode) {
      case 'slide':
        return slideUpVariants;
      case 'scale':
        return scaleVariants;
      default:
        return fadeVariants;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={getVariants()}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * ホバーアニメーション
 */
interface HoverAnimationProps extends AnimationProps {
  hoverScale?: number;
  hoverY?: number;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({ 
  children, 
  hoverScale = 1.02,
  hoverY = -4,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: {
          duration: parseFloat(motionTokens.duration.medium1) / 1000,
          ease: easingFunctions.standard,
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          duration: parseFloat(motionTokens.duration.short2) / 1000,
          ease: easingFunctions.emphasized,
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * レイアウトアニメーション（自動レイアウト変更アニメーション）
 */
export const LayoutAnimation: React.FC<AnimationProps> = ({ children, ...props }) => {
  return (
    <motion.div
      layout
      transition={{
        layout: {
          duration: parseFloat(motionTokens.duration.medium3) / 1000,
          ease: easingFunctions.emphasized,
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ==================== Hooks ====================

/**
 * Reduced Motion設定を考慮したアニメーション制御
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * アニメーション設定を動的に調整するフック
 */
export const useMotionConfig = () => {
  const prefersReducedMotion = useReducedMotion();

  return React.useMemo(() => ({
    transition: {
      duration: prefersReducedMotion ? 0.01 : parseFloat(motionTokens.duration.medium2) / 1000,
      ease: easingFunctions.standard,
    },
    initial: prefersReducedMotion ? false : 'hidden',
    animate: 'visible',
    exit: prefersReducedMotion ? false : 'exit',
  }), [prefersReducedMotion]);
};

// ==================== Export All ====================

export {
  motion,
  AnimatePresence,
  type Variants,
};
