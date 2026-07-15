"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RotateCcw, X } from "lucide-react";

export default function ErrorToast({
  message,
  visible,
  onRetry,
  onClose,
}: {
  message: string;
  visible: boolean;
  onRetry?: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, -2, 2, 0] }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ x: { duration: 0.5 }, default: { duration: 0.3 } }}
          className="glass-panel-strong fixed right-6 top-24 z-[200] flex max-w-sm items-start gap-3 rounded-2xl border-rose-500/30 px-5 py-4 shadow-[0_0_30px_rgba(244,63,94,0.25)]"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="flex-1">
            <p className="text-sm text-bone">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-300 hover:text-rose-200"
              >
                <RotateCcw className="h-3 w-3" />
                Try again
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-smoke hover:text-bone">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
