"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className,
  tilt = true,
  strong = false,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  strong?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={cn(
        strong ? "glass-panel-strong" : "glass-panel",
        "rounded-3xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
