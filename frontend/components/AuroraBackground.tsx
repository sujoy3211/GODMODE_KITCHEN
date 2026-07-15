"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const FLOATERS = [
  { icon: "🍋", size: 34, top: "12%", left: "8%", depth: 18, delay: 0 },
  { icon: "🌿", size: 28, top: "68%", left: "6%", depth: 30, delay: 1.2 },
  { icon: "🥕", size: 30, top: "22%", left: "88%", depth: 24, delay: 0.6 },
  { icon: "🧄", size: 24, top: "78%", left: "90%", depth: 14, delay: 2 },
  { icon: "🍅", size: 26, top: "48%", left: "94%", depth: 20, delay: 0.9 },
  { icon: "🌶️", size: 22, top: "85%", left: "35%", depth: 26, delay: 1.6 },
  { icon: "🥄", size: 30, top: "8%", left: "45%", depth: 12, delay: 0.3 },
  { icon: "🫒", size: 20, top: "35%", left: "3%", depth: 22, delay: 1.9 },
];

export default function AuroraBackground() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w - 0.5) * 2);
      my.set((e.clientY / h - 0.5) * 2);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mx, my]);

  const auroraX = useTransform(sx, [-1, 1], [-40, 40]);
  const auroraY = useTransform(sy, [-1, 1], [-40, 40]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-obsidian" />

      {/* animated aurora blobs, mouse reactive */}
      <motion.div
        style={{ x: auroraX, y: auroraY }}
        className="absolute -top-1/4 left-0 h-[70vh] w-[70vh] rounded-full bg-aurora-1 blur-3xl opacity-70"
      />
      <motion.div
        style={{ x: useTransform(auroraX, (v) => -v), y: auroraY }}
        className="absolute top-0 right-0 h-[60vh] w-[60vh] rounded-full bg-aurora-2 blur-3xl opacity-60"
      />
      <motion.div
        style={{ x: auroraX, y: useTransform(auroraY, (v) => -v) }}
        className="absolute bottom-0 left-1/4 h-[65vh] w-[65vh] rounded-full bg-aurora-3 blur-3xl opacity-50 animate-drift"
      />

      {/* light rays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian/90" />

      {/* floating ingredient icons */}
      {FLOATERS.map((f, i) => (
        <motion.span
          key={i}
          className="absolute select-none opacity-30 drop-shadow-[0_0_18px_rgba(34, 197, 125,0.35)]"
          style={{ top: f.top, left: f.left, fontSize: f.size }}
          animate={{ y: [0, -f.depth, 0], rotate: [0, 6, -4, 0] }}
          transition={{
            duration: 8 + f.depth / 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: f.delay,
          }}
        >
          {f.icon}
        </motion.span>
      ))}

      {/* film grain */}
      <div className="grain-overlay absolute inset-0 opacity-40" />

      {/* vignette */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
