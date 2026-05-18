import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  color: 'cyan' | 'purple';
  phase: number;
  pulseSpeed: number;
}

interface GlowOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: 'cyan' | 'purple';
  opacity: number;
}

interface Props {
  darkMode?: boolean;
  count?: number;
}

export default function ParticleBackground({ darkMode = true, count }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<GlowOrb[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = count ?? (isMobile ? 25 : 50);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 3 + 1.5,
      baseOpacity: Math.random() * 0.35 + 0.25,
      color: Math.random() > 0.5 ? 'cyan' : 'purple',
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.4 + Math.random() * 0.6,
    }));

    const orbCount = isMobile ? 2 : 4;
    orbsRef.current = Array.from({ length: orbCount }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      radius: 200 + Math.random() * 200,
      color: i % 2 === 0 ? 'cyan' : 'purple',
      opacity: 0.04 + Math.random() * 0.04,
    }));

    let paused = false;
    const handleVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    let t = 0;
    const REPEL_RADIUS = 100;
    const REPEL_STRENGTH = 0.8;
    const CONNECTION_DIST = 110;

    const draw = () => {
      if (paused) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Glow orbs
      orbsRef.current.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.radius) orb.x = w + orb.radius;
        if (orb.x > w + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = h + orb.radius;
        if (orb.y > h + orb.radius) orb.y = -orb.radius;

        const rgb = orb.color === 'cyan' ? '0,212,255' : '168,85,247';
        const grd = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grd.addColorStop(0, `rgba(${rgb},${orb.opacity})`);
        grd.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // Move particles + repel
      const particles = particlesRef.current;
      particles.forEach(p => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          p.vx += (dx / dist) * force * 0.05;
          p.vy += (dy / dist) * force * 0.05;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      });

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * (darkMode ? 0.4 : 0.2);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = darkMode ? `rgba(0,212,255,${alpha})` : `rgba(168,85,247,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        const pulse = 0.8 + 0.4 * (0.5 + 0.5 * Math.sin(t * p.pulseSpeed + p.phase));
        const opacity = p.baseOpacity * pulse;
        const drawSize = p.size * pulse;
        const cyanRgb = darkMode ? '0,212,255' : '0,153,204';
        const purpleRgb = darkMode ? '168,85,247' : '139,92,246';
        const rgb = p.color === 'cyan' ? cyanRgb : purpleRgb;

        if (darkMode) {
          const glowSize = drawSize * 4;
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
          grd.addColorStop(0, `rgba(${rgb},${opacity * 0.5})`);
          grd.addColorStop(1, `rgba(${rgb},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${Math.min(opacity * 1.2, 1)})`;
        ctx.fill();
      });

      // Radial vignette
      if (darkMode) {
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.sqrt(cx * cx + cy * cy);
        const vignette = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
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
