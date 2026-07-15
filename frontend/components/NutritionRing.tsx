"use client";

import { motion } from "framer-motion";

export default function NutritionRing({
  label,
  value,
  max,
  unit,
  color = "#1fbf72",
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: string;
}) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference * (1 - pct) }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-semibold">{value}</span>
          <span className="text-[10px] text-white/40">{unit}</span>
        </div>
      </div>
      <span className="text-xs text-white/50">{label}</span>
    </div>
  );
}
