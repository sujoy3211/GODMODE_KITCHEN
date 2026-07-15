"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, Share2, Download, Clock, Users, Flame } from "lucide-react";
import NutritionRing from "./NutritionRing";
import Badge from "./ui/Badge";
import type { Recipe } from "@/lib/types";

export default function RecipeModal({
  recipe,
  onClose,
  onSave,
  saved,
}: {
  recipe: Recipe | null;
  onClose: () => void;
  onSave: (r: Recipe) => void;
  saved: boolean;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    if (!recipe) return;
    setChecked({});
    setVisibleSteps(0);
    const total = recipe.steps.length;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setVisibleSteps(i);
      if (i >= total) clearInterval(t);
    }, 220);
    return () => clearInterval(t);
  }, [recipe]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const share = async () => {
    if (!recipe) return;
    const text = `${recipe.title} — made with Nourish AI`;
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const download = () => {
    if (!recipe) return;
    const content = [
      recipe.title,
      recipe.description,
      "",
      "Ingredients:",
      ...recipe.ingredients_used.map((i) => `- ${i}`),
      "",
      "Steps:",
      ...recipe.steps.map((s) => `${s.step_number}. ${s.instruction}`),
      "",
      "Nutrition (per serving):",
      `Calories: ${recipe.nutrition.calories}`,
      `Protein: ${recipe.nutrition.protein_g}g`,
      `Carbs: ${recipe.nutrition.carbs_g}g`,
      `Fat: ${recipe.nutrition.fat_g}g`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {recipe && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-obsidian/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed inset-4 z-[110] mx-auto flex max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-char shadow-glass sm:inset-x-6 sm:inset-y-8 md:inset-x-auto md:inset-y-10 md:h-[calc(100vh-5rem)] md:w-full"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div className="flex items-center gap-2">
                <Badge tone="gold">{recipe.difficulty}</Badge>
                <Badge tone="neutral">{recipe.cuisine}</Badge>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-smoke transition-colors hover:bg-white/5 hover:text-bone"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <h2 className="font-display text-3xl italic leading-tight sm:text-4xl">{recipe.title}</h2>
              <p className="mt-2 text-sm text-smoke">{recipe.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-smoke">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {recipe.total_time_minutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {recipe.servings} servings
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" /> {recipe.nutrition.calories} kcal
                </span>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-2 rounded-2xl border border-white/5 bg-black/20 px-4 py-5">
                <NutritionRing label="Protein" value={recipe.nutrition.protein_g} max={60} unit="g" color="#22C57D" />
                <NutritionRing label="Carbs" value={recipe.nutrition.carbs_g} max={100} unit="g" color="#D6A253" />
                <NutritionRing label="Fat" value={recipe.nutrition.fat_g} max={40} unit="g" color="#E2725B" />
                <NutritionRing label="Fiber" value={recipe.nutrition.fiber_g} max={20} unit="g" color="#22C57D" />
              </div>

              <div className="mt-8">
                <h3 className="mb-3 font-display text-lg italic">Ingredients</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {recipe.ingredients_used.map((ing) => {
                    const isChecked = !!checked[ing];
                    return (
                      <button
                        key={ing}
                        onClick={() => setChecked((c) => ({ ...c, [ing]: !c[ing] }))}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/15 px-3 py-2.5 text-left"
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isChecked ? "border-verdant bg-verdant" : "border-white/20"
                          }`}
                        />
                        <span className={`text-sm ${isChecked ? "text-smoke line-through" : "text-bone/80"}`}>
                          {ing}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-3 font-display text-lg italic">Steps</h3>
                <ol className="space-y-3">
                  {recipe.steps.map((step, i) => (
                    <motion.li
                      key={step.step_number}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: i < visibleSteps ? 1 : 0.15, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-verdant/15 text-xs font-semibold text-verdant">
                        {step.step_number}
                      </span>
                      <p className="text-sm text-bone/75">
                        {step.instruction}
                        {step.duration_minutes ? (
                          <span className="ml-2 font-mono text-xs text-saffron/80">
                            {step.duration_minutes}m
                          </span>
                        ) : null}
                      </p>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-white/5 px-6 py-4">
              <button
                onClick={() => onSave(recipe)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors ${
                  saved ? "bg-rose-500/15 text-rose-300" : "bg-verdant/15 text-verdant hover:bg-verdant/25"
                }`}
              >
                <Heart className={`h-4 w-4 ${saved ? "fill-rose-400" : ""}`} />
                {saved ? "Saved" : "Save recipe"}
              </button>
              <button
                onClick={share}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-smoke hover:border-white/25 hover:text-bone"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={download}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-smoke hover:border-white/25 hover:text-bone"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
