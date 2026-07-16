"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import GlassCard from "./ui/GlassCard";

const LINES = [
  "Analyzing ingredients…",
  "Understanding nutrition…",
  "Finding recipes…",
  "Calculating macros…",
  "Optimizing taste…",
  "Building shopping list…",
];

const NODES = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  return {
    x: 50 + Math.cos(angle) * (32 + (i % 3) * 4),
    y: 50 + Math.sin(angle) * (32 + (i % 3) * 4),
    delay: i * 0.15,
  };
});

export default function GenerationLoader() {
  const [line, setLine] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLine((l) => (l + 1) % LINES.length), 950);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <GlassCard strong tilt={false} className="w-full p-10">
        {/* neural network + core */}
        <div className="relative mx-auto mb-8 h-40 w-40">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            {NODES.map((n, i) => {
              const next = NODES[(i + 1) % NODES.length];
              return (
                <motion.line
                  key={`l-${i}`}
                  x1={n.x}
                  y1={n.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="rgba(34, 197, 125,0.35)"
                  strokeWidth={0.4}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, delay: n.delay, repeat: Infinity, repeatType: "reverse" }}
                />
              );
            })}
            {NODES.map((n, i) => (
              <motion.circle
                key={`n-${i}`}
                cx={n.x}
                cy={n.y}
                r={1.6}
                fill={i % 3 === 0 ? "#D6A253" : "#22C57D"}
                animate={{ opacity: [0.4, 1, 0.4], r: [1.2, 2, 1.2] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: n.delay }}
              />
            ))}
          </svg>

          <motion.div
            className="absolute inset-8 rounded-full border border-verdant/25"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-11 rounded-full border border-dashed border-saffron/25"
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-verdant to-verdant-deep shadow-[0_0_45px_rgba(34, 197, 125,0.5)]"
            >
              <ChefHat className="h-7 w-7 text-obsidian" />
            </motion.div>
          </div>
        </div>

        <h3 className="font-display text-2xl italic">PetPooja AI is thinking…</h3>

        <div className="mt-3 h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={line}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-sm text-verdant"
            >
              {LINES[line]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-verdant to-saffron"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            style={{ width: "40%" }}
          />
        </div>
      </GlassCard>
    </section>
  );
}
