"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function SuccessToast({
  message,
  visible,
  onDone,
}: {
  message: string;
  visible: boolean;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      confetti({
        particleCount: 60,
        spread: 65,
        startVelocity: 32,
        origin: { x: 0.9, y: 0.15 },
        colors: ["#22C57D", "#D6A253", "#F3F1EA"],
        disableForReducedMotion: true,
      });
    }
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [visible, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="glass-panel-strong fixed right-6 top-24 z-[200] flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-[0_0_30px_rgba(34, 197, 125,0.25)]"
        >
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260 }}
          >
            <CheckCircle2 className="h-5 w-5 text-verdant" />
          </motion.span>
          <span className="text-sm text-bone">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
