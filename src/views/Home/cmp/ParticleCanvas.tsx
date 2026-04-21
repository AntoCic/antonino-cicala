import { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  particleCount?: number;
  accentCyan?: string;
  accentGreen?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  color: string;
  pulseOffset: number;
}

export default function ParticleCanvas({
  particleCount = 80,
  accentCyan = '#0ac9ff',
  accentGreen = '#0ae448',
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let time = 0;
    const dpr = window.devicePixelRatio || 1;

    function initParticles(width: number, height: number) {
      const count = width < 500 ? Math.floor(particleCount / 2) : particleCount;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        baseOpacity: Math.random() * 0.4 + 0.2,
        color: Math.random() < 0.6 ? accentCyan : accentGreen,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.scale(dpr, dpr);
      initParticles(w, h);
    }

    function draw() {
      time += 0.016;

      ctx!.fillStyle = 'rgba(6,16,29,0.18)';
      ctx!.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const opacity = p.baseOpacity + 0.15 * Math.sin(time * 0.8 + p.pulseOffset);

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = p.color + Math.round(opacity * 255).toString(16).padStart(2, '0');
        ctx!.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.18;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.strokeStyle = p.color + Math.round(lineAlpha * 255).toString(16).padStart(2, '0');
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });
    ro.observe(canvas.parentElement!);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [particleCount, accentCyan, accentGreen]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
}
