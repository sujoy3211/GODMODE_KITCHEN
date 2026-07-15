"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChefHat } from "lucide-react";

const LINES = ["Preheating the AI kitchen…", "Sharpening the algorithms…", "Plating the experience…"];

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const lineTimer = setInterval(() => setLine((l) => (l + 1) % LINES.length), 700);
    const doneTimer = setTimeout(() => setVisible(false), 2200);
    return () => {
      clearInterval(lineTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-obsidian"
        >
          <div className="relative flex h-28 w-28 items-center justify-center">
            <motion.span
              className="absolute inset-0 rounded-full border border-verdant/25"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-3 rounded-full border border-saffron/20 border-dashed"
              animate={{ rotate: -360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-verdant to-verdant-deep shadow-[0_0_50px_rgba(34, 197, 125,0.45)]"
            >
              <ChefHat className="h-8 w-8 text-obsidian" />
            </motion.div>
          </div>

          <div className="mt-8 h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={line}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="font-mono text-xs tracking-[0.2em] text-smoke uppercase"
              >
                {LINES[line]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
