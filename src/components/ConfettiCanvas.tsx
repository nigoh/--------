
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface ConfettiCanvasHandle {
  launch: () => void;
  stop: () => void;
}

type ConfettiCanvasProps = {};

const ConfettiCanvas = forwardRef<ConfettiCanvasHandle, ConfettiCanvasProps>((props, ref): React.ReactElement | null => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiAnim = useRef<number | null>(null);
  const stopFlag = useRef(false);

  // 紙吹雪・花火・風船の型
  type Confetti = { x: number; y: number; r: number; d: number; color: string; tilt: number };
  type FireworkParticle = { x: number; y: number; vx: number; vy: number; alpha: number; color: string };
  type Firework = { particles: FireworkParticle[] };
  type Balloon = { x: number; y: number; r: number; color: string; vy: number; burst: boolean; burstFrame: number };

  // 紙吹雪・花火・風船の状態はローカル変数で管理
  let confetti: Confetti[] = [];
  let fireworks: Firework[] = [];
  let balloons: Balloon[] = [];

  // フェードアウト用（useRefでグローバル管理）
  const fadeAlpha = useRef(1);
  const fading = useRef(false);

  function launchConfetti() {
    // 既存のアニメーションが残っていれば必ずキャンセル
    if (confettiAnim.current) {
      cancelAnimationFrame(confettiAnim.current);
      confettiAnim.current = null;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const confettiCount = 400;
    confetti = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H - H,
      r: Math.random() * 4 + 2,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.random() * 360},90%,60%)`,
      tilt: Math.random() * 10 - 10,
      vx: (Math.random() - 0.5) * 2 // 左右のランダム速度
    }));
    fireworks = [];
    let angle = 0;
    let tiltAngle = 0;
    let frame = 0;
    stopFlag.current = false;
    fadeAlpha.current = 1;
    fading.current = false;
    // 風船を初期化（小さめに）
    const balloonCount = 12;
    balloons = Array.from({ length: balloonCount }, () => {
      // 風船の大きさをさらに大きくランダム化（16〜56px）
      const r = Math.random() * 40 + 16;
      return {
        x: Math.random() * W * 0.8 + W * 0.1,
        y: H + Math.random() * 120,
        r,
        color: `hsl(${Math.random() * 360},80%,70%)`,
        vy: Math.random() * 1.2 + 1.1,
        burst: false,
        burstFrame: 0
      };
    });
    function spawnFirework() {
      // 1回で複数の花火を同時に打ち上げ
      const fireworkNum = 3;
      for (let f = 0; f < fireworkNum; f++) {
        const x = Math.random() * W * 0.8 + W * 0.1;
        const y = Math.random() * H * 0.3 + H * 0.1;
        // 日本の花火のように1発で多色
        const baseHue = Math.floor(Math.random() * 360);
        const particles = Array.from({ length: 32 }, (_, i) => {
          const angle = (Math.PI * 2) * (i / 32);
          const speed = Math.random() * 3 + 2;
          // 1発の中で色相をずらしてカラフルに
          const hue = (baseHue + i * (360 / 32)) % 360;
          const color = `hsl(${hue},90%,60%)`;
          return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color
          };
        });
        fireworks.push({ particles });
      }
    }
    // 5秒後に自動でフェードアウト
    setTimeout(() => {
      stopFlag.current = true;
    }, 5000);
    function draw() {
      if (!ctx) return;
      // フェードアウト処理
      if (stopFlag.current) {
        fading.current = true;
      }
      if (fading.current) {
        fadeAlpha.current -= 0.001; // フェードアウトをゆっくりに
        if (fadeAlpha.current <= 0) {
          ctx.clearRect(0, 0, W, H);
          if (confettiAnim.current) {
            cancelAnimationFrame(confettiAnim.current);
            confettiAnim.current = null;
          }
          // ループを完全停止
          return;
        }
      } else {
        fadeAlpha.current = 1;
      }
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.globalAlpha = fadeAlpha.current;


      // 風船
      balloons.forEach((b, i) => {
        if (!b.burst) {
          // 風船本体
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(b.x, b.y, b.r * 0.7, b.r, 0, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = 0.85 * fadeAlpha.current;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
          // ハイライト
          ctx.beginPath();
          ctx.ellipse(b.x - b.r * 0.2, b.y - b.r * 0.4, b.r * 0.13, b.r * 0.22, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.35)';
          ctx.fill();
          // 紐
          ctx.beginPath();
          ctx.moveTo(b.x, b.y + b.r);
          ctx.bezierCurveTo(b.x - 8, b.y + b.r + 18, b.x + 8, b.y + b.r + 28, b.x, b.y + b.r + 38);
          ctx.strokeStyle = '#aaa';
          ctx.lineWidth = 2;
          ctx.globalAlpha = fadeAlpha.current;
          ctx.stroke();
          ctx.restore();
        } else {
          // 割れた風船の破片
          const frag = 8;
          for (let j = 0; j < frag; j++) {
            ctx.save();
            ctx.beginPath();
            const theta = (Math.PI * 2 * j) / frag;
            const len = b.r * 0.7 + b.burstFrame * 2;
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x + Math.cos(theta) * len, b.y + Math.sin(theta) * len);
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 3 + Math.random() * 2;
            ctx.globalAlpha = (0.7 - b.burstFrame * 0.04) * fadeAlpha.current;
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      // 紙吹雪
      confetti.forEach((c, i) => {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
        ctx.stroke();
        ctx.restore();
      });
      // 花火
      fireworks.forEach(fw => {
        fw.particles.forEach(p => {
          ctx.save();
          ctx.globalAlpha = p.alpha * fadeAlpha.current;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();
        });
      });
      // update
      angle += 0.01;
      tiltAngle += 0.1;
      // 風船のアニメーション
      balloons.forEach((b) => {
        if (!b.burst) {
          b.y -= b.vy;
          // 一定確率で割れる
          if (b.y < H * 0.18 + Math.random() * 60 && Math.random() < 0.012) {
            b.burst = true;
            b.burstFrame = 0;
          }
        } else {
          b.burstFrame++;
        }
      });
      // 割れた風船を消す
      for (let i = balloons.length - 1; i >= 0; i--) {
        if (balloons[i].burst && balloons[i].burstFrame > 18) {
          balloons.splice(i, 1);
        }
      }
      // 風船が減ったら新たに追加
      while (balloons.length < balloonCount) {
        // 風船の大きさをさらに大きくランダム化（16〜56px）
        const r = Math.random() * 40 + 16;
        balloons.push({
          x: Math.random() * W * 0.8 + W * 0.1,
          y: H + Math.random() * 120,
          r,
          color: `hsl(${Math.random() * 360},80%,70%)`,
          vy: Math.random() * 1.2 + 1.1,
          burst: false,
          burstFrame: 0
        });
      }
      // 紙吹雪
      confetti.forEach((c, i) => {
        // 左右の揺れとランダムな横移動
        c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) * 0.8;
        c.x += Math.sin(angle + c.d * 0.2) + (c as any).vx;
        c.tilt = Math.sin(tiltAngle - i / 3) * 15;
        if (c.y > H || c.x < -20 || c.x > W + 20) {
          c.x = Math.random() * W;
          c.y = -10;
        }
      });
      // 花火
      fireworks.forEach(fw => {
        fw.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.alpha -= 0.012;
        });
      });
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].particles = fireworks[i].particles.filter(p => p.alpha > 0);
        if (fireworks[i].particles.length === 0) fireworks.splice(i, 1);
      }
      frame++;
      if (frame % 20 === 0) spawnFirework();
      // 既に停止済みなら新たなループを作らない
      if (!stopFlag.current || fading.current) {
        confettiAnim.current = requestAnimationFrame(draw);
      }
    }
    draw();
  }

  useImperativeHandle(ref, () => ({
    launch: () => {
      stopFlag.current = false;
      launchConfetti();
    },
    stop: () => {
      stopFlag.current = true;
      // 完全停止・クリアはフェードアウト後にdraw内で行う
      console.log('Confetti/Fireworks stopped');
    }
  }));

  useEffect(() => {
    return () => {
      stopFlag.current = true;
      if (confettiAnim.current) cancelAnimationFrame(confettiAnim.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
});

export default ConfettiCanvas;
