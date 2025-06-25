import React from 'react';
import { Box, keyframes } from '@mui/material';

// アニメーションキーフレームの定義
const float1 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(15px) rotate(240deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  50% { transform: translateX(40px) rotate(180deg); }
`;

const float3 = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-25px) translateX(30px) rotate(90deg); }
  50% { transform: translateY(30px) translateX(-15px) rotate(180deg); }
  75% { transform: translateY(-15px) translateX(-30px) rotate(270deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.2); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const drift = keyframes`
  0%, 100% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(20px) translateY(-10px); }
  50% { transform: translateX(-15px) translateY(15px); }
  75% { transform: translateX(-20px) translateY(-5px); }
`;

// 新しい輝きアニメーション
const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
`;

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        opacity: 0.9,
        zIndex: -2
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.2) 0%, transparent 50%)',
        zIndex: -1
      }
    }}>
      {/* 幾何学模様のアニメーション要素 */}
      
      {/* 大きな三角形 */}
      <Box sx={{
        position: 'absolute',
        top: '8%',
        left: '12%',
        width: 0,
        height: 0,
        borderLeft: '30px solid transparent',
        borderRight: '30px solid transparent',
        borderBottom: '50px solid rgba(255, 255, 255, 0.08)',
        animation: `${float1} 12s ease-in-out infinite`,
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        top: '65%',
        right: '15%',
        width: 0,
        height: 0,
        borderLeft: '25px solid transparent',
        borderRight: '25px solid transparent',
        borderBottom: '40px solid rgba(255, 255, 255, 0.06)',
        animation: `${float2} 9s ease-in-out infinite`,
        zIndex: -1
      }} />

      {/* グラデーション円形 */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        right: '8%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        animation: `${pulse} 6s ease-in-out infinite`,
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '8%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        animation: `${float3} 14s ease-in-out infinite`,
        zIndex: -1
      }} />

      {/* 回転する四角形 */}
      <Box sx={{
        position: 'absolute',
        top: '45%',
        left: '3%',
        width: '40px',
        height: '40px',
        background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        animation: `${rotate} 20s linear infinite`,
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        bottom: '25%',
        right: '12%',
        width: '35px',
        height: '35px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        transform: 'rotate(45deg)',
        animation: `${float1} 10s ease-in-out infinite`,
        zIndex: -1
      }} />

      {/* 六角形とダイヤモンド */}
      <Box sx={{
        position: 'absolute',
        top: '75%',
        left: '20%',
        width: '70px',
        height: '70px',
        background: 'rgba(255, 255, 255, 0.06)',
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
        animation: `${drift} 16s ease-in-out infinite`,
        zIndex: -1
      }} />

      {/* 動く線形要素 */}
      <Box sx={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        width: '3px',
        height: '100px',
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15), transparent)',
        animation: `${rotate} 25s linear infinite`,
        transformOrigin: 'center bottom',
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        bottom: '35%',
        right: '25%',
        width: '80px',
        height: '3px',
        background: 'linear-gradient(to right, rgba(255, 255, 255, 0.12), transparent)',
        animation: `${float3} 11s ease-in-out infinite`,
        zIndex: -1
      }} />

      {/* 小さな装飾要素群 */}
      <Box sx={{
        position: 'absolute',
        top: '85%',
        left: '75%',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        animation: `${pulse} 4s ease-in-out infinite`,
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        top: '35%',
        left: '85%',
        width: '15px',
        height: '15px',
        background: 'rgba(255, 255, 255, 0.08)',
        transform: 'rotate(45deg)',
        animation: `${float2} 8s ease-in-out infinite`,
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '90%',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.06)',
        animation: `${drift} 7s ease-in-out infinite`,
        zIndex: -1
      }} />

      {/* さらに小さな点々 */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '70%',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.12)',
        animation: `${pulse} 3s ease-in-out infinite`,
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        top: '60%',
        left: '5%',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        animation: `${float1} 5s ease-in-out infinite`,
        zIndex: -1
      }} />

      {/* 新しい輝き要素 */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.8)',
        animation: `${sparkle} 3s ease-in-out infinite 0.5s`,
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        top: '70%',
        right: '15%',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.6)',
        animation: `${sparkle} 2.5s ease-in-out infinite 1s`,
        zIndex: -1
      }} />

      <Box sx={{
        position: 'absolute',
        top: '40%',
        left: '5%',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.4)',
        animation: `${twinkle} 4s ease-in-out infinite`,
        zIndex: -1
      }} />

      {/* コンテンツ */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AnimatedBackground;
