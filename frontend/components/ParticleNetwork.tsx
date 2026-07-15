"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function ParticleNetwork({ density = 55 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let paused = false;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((width * height) / (12000 / (density / 55)));
      nodes = Array.from({ length: Math.min(count, 90) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        if (!prefersReduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            n.x -= dx * 0.0025;
            n.y -= dy * 0.0025;
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(34, 197, 125, ${0.14 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = "rgba(34, 197, 125, 0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!paused) raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />;
}
