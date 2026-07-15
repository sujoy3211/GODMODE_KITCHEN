"use client";

import { motion } from "framer-motion";
import { Flame, Dumbbell, Sparkles, Heart } from "lucide-react";

const STATS = [
  { icon: Flame, label: "Calories tracked", value: "2.4M+", top: "6%", left: "-6%", delay: 0 },
  { icon: Dumbbell, label: "Protein optimized", value: "38g avg", top: "62%", left: "-10%", delay: 0.6 },
  { icon: Sparkles, label: "Recipes generated", value: "128K+", top: "2%", left: "78%", delay: 1.1 },
  { icon: Heart, label: "Favorite meals", value: "41K saved", top: "68%", left: "80%", delay: 1.7 },
];

export default function StatCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 + i * 0.15, duration: 0.8 }}
            style={{ top: s.top, left: s.left }}
            className="absolute"
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, i % 2 === 0 ? 2 : -2, 0] }}
              transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
              className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3 shadow-glass"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-verdant/15 text-verdant">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-mono text-sm font-semibold text-bone">{s.value}</p>
                <p className="text-[10px] text-smoke">{s.label}</p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
