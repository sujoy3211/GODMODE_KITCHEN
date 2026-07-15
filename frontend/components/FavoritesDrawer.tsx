"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, ChefHat } from "lucide-react";
import type { FavoriteOut } from "@/lib/types";

export default function FavoritesDrawer({
  open,
  onClose,
  favorites,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  favorites: FavoriteOut[];
  onDelete: (id: number) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="glass-panel-strong fixed right-0 top-0 z-[90] h-full w-full max-w-md overflow-y-auto p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl italic">Your favorites</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center text-white/40">
                <ChefHat className="h-10 w-10" />
                <p>No saved recipes yet.</p>
                <p className="text-xs">Tap the heart on any recipe to save it here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((f) => (
                  <motion.div
                    key={f.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg italic leading-tight">{f.recipe.title}</p>
                        <p className="mt-1 text-xs text-white/40">
                          {f.recipe.cuisine} · {f.recipe.total_time_minutes} min ·{" "}
                          {f.recipe.nutrition.calories} kcal
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(f.id)}
                        className="shrink-0 rounded-full p-2 text-white/30 hover:bg-rose-500/10 hover:text-rose-400"
                        aria-label="Remove favorite"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
