import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: 'cyan' | 'purple';
  phase: number;
}

interface Props {
  darkMode?: boolean;
  count?: number;
}

export default function ParticleBackground({ darkMode = true, count }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = count ?? (isMobile ? 20 : 40);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.4 + 0.3,
      color: Math.random() > 0.5 ? 'cyan' : 'purple',
      phase: Math.random() * Math.PI * 2,
    }));

    let paused = false;
    const handleVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    let t = 0;
    const draw = () => {
      if (paused) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Move particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      });

      // Draw connection lines
      const connectionDist = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (darkMode ? 0.15 : 0.08);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = darkMode
              ? `rgba(0,212,255,${alpha})`
              : `rgba(168,85,247,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        const pulse = Math.sin(t * 2 + p.phase) * 0.2 + 0.8;
        const opacity = p.opacity * pulse;
        const glowSize = p.size * (darkMode ? 4 : 2);

        const cyanColor = darkMode ? '0,212,255' : '0,153,204';
        const purpleColor = darkMode ? '168,85,247' : '139,92,246';
        const rgb = p.color === 'cyan' ? cyanColor : purpleColor;

        // Glow
        if (darkMode) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
          grd.addColorStop(0, `rgba(${rgb},${opacity * 0.6})`);
          grd.addColorStop(1, `rgba(${rgb},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${opacity})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [darkMode, count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
