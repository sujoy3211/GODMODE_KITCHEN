"use client";

import { ButtonHTMLAttributes, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  magnetic?: boolean;
}

export default function Button({
  variant = "primary",
  magnetic = true,
  className,
  children,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setPos({ x: relX * 0.25, y: relY * 0.35 });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const styles = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-emerald-400 text-obsidian shadow-glow-emerald hover:shadow-[0_0_60px_rgba(34, 197, 125,0.55)]",
    outline:
      "border border-white/20 text-white hover:border-emerald-400/60 hover:text-emerald-200",
    ghost: "text-white/80 hover:text-white",
  } as const;

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
      whileTap={{ scale: 0.94 }}
      className={cn("btn-magnetic", styles[variant], className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
