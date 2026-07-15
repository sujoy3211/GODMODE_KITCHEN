"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBasket, Check } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import type { ShoppingItem } from "@/lib/types";

export default function ShoppingList({ items }: { items: ShoppingItem[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (items.length === 0) {
    return (
      <GlassCard strong tilt={false} className="p-8 text-center">
        <p className="text-white/60">
          You already have everything you need. No shopping required today. 🎉
        </p>
      </GlassCard>
    );
  }

  const toggle = (name: string) => setChecked((c) => ({ ...c, [name]: !c[name] }));

  return (
    <GlassCard strong tilt={false} className="p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
          <ShoppingBasket className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-xl italic">Shopping list</h3>
          <p className="text-xs text-white/40">Everything missing across your 3 recipes</p>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((item, i) => {
          const isChecked = !!checked[item.name];
          return (
            <motion.li
              key={`${item.name}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => toggle(item.name)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-black/15 px-4 py-3 text-left transition-colors hover:border-white/15"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    isChecked
                      ? "border-emerald-400 bg-emerald-500"
                      : "border-white/20 bg-transparent"
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5 text-obsidian" />}
                </span>
                <span className={`flex-1 text-sm ${isChecked ? "text-white/30 line-through" : "text-white/80"}`}>
                  {item.name}
                </span>
                <span className="text-xs text-white/40">{item.quantity}</span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
