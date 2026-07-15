"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { INGREDIENT_SUGGESTIONS } from "@/lib/utils";

export default function IngredientTagInput({
  ingredients,
  setIngredients,
}: {
  ingredients: string[];
  setIngredients: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("");
      return;
    }
    setIngredients([...ingredients, trimmed]);
    setDraft("");
  };

  const remove = (value: string) => {
    setIngredients(ingredients.filter((i) => i !== value));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && draft === "" && ingredients.length > 0) {
      remove(ingredients[ingredients.length - 1]);
    }
  };

  const unusedSuggestions = INGREDIENT_SUGGESTIONS.filter(
    (s) => !ingredients.some((i) => i.toLowerCase() === s.toLowerCase())
  ).slice(0, 8);

  return (
    <div>
      <div className="flex min-h-[64px] flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 transition-colors focus-within:border-emerald-400/50">
        <AnimatePresence initial={false}>
          {ingredients.map((ing) => (
            <motion.span
              key={ing}
              layout
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1.5 text-sm text-emerald-200"
            >
              {ing}
              <button
                type="button"
                onClick={() => remove(ing)}
                aria-label={`Remove ${ing}`}
                className="rounded-full p-0.5 hover:bg-emerald-400/20"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft && add(draft)}
          placeholder={ingredients.length === 0 ? "Type an ingredient and press Enter…" : "Add another…"}
          className="min-w-[140px] flex-1 bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
      </div>

      {unusedSuggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {unusedSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/50 transition-colors hover:border-emerald-400/40 hover:text-emerald-300"
            >
              <Plus className="h-3 w-3" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
