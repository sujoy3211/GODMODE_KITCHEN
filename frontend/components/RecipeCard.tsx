"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, ChevronDown, Heart, Copy, Check, Users, Flame } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import Badge from "./ui/Badge";
import NutritionRing from "./NutritionRing";
import type { Recipe } from "@/lib/types";

export default function RecipeCard({
  recipe,
  index,
  onSave,
  saved,
  onOpenModal,
}: {
  recipe: Recipe;
  index: number;
  onSave: (r: Recipe) => void;
  saved: boolean;
  onOpenModal: (r: Recipe) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyRecipe = async () => {
    const text = [
      recipe.title,
      recipe.description,
      "",
      "Ingredients used:",
      ...recipe.ingredients_used.map((i) => `- ${i}`),
      "",
      "Steps:",
      ...recipe.steps.map((s) => `${s.step_number}. ${s.instruction}`),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard strong className="flex h-full flex-col overflow-hidden">
        <div className="relative p-6 pb-4">
          <div className="mb-3 flex items-center justify-between">
            <Badge tone={index === 0 ? "gold" : "emerald"}>{recipe.difficulty}</Badge>
            <button
              onClick={() => onSave(recipe)}
              aria-label="Save to favorites"
              className="group"
            >
              <motion.span whileTap={{ scale: 1.4 }} className="block">
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    saved ? "fill-rose-500 text-rose-500" : "text-white/40 group-hover:text-rose-400"
                  }`}
                />
              </motion.span>
            </button>
          </div>

          <h3 className="font-display text-2xl italic leading-tight">{recipe.title}</h3>
          <p className="mt-2 text-sm text-white/55">{recipe.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
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

          {recipe.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {recipe.tags.map((t) => (
                <Badge key={t} tone="neutral">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 border-y border-white/5 bg-black/15 px-4 py-5">
          <NutritionRing label="Protein" value={recipe.nutrition.protein_g} max={60} unit="g" color="#3fd88a" />
          <NutritionRing label="Carbs" value={recipe.nutrition.carbs_g} max={100} unit="g" color="#dcb655" />
          <NutritionRing label="Fat" value={recipe.nutrition.fat_g} max={40} unit="g" color="#e8cd82" />
          <NutritionRing label="Fiber" value={recipe.nutrition.fiber_g} max={20} unit="g" color="#1fbf72" />
        </div>

        <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium text-emerald-300 transition-colors hover:bg-white/[0.03]"
          >
            {expanded ? "Hide" : "Quick"} preview
            <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
          <button
            onClick={() => onOpenModal(recipe)}
            className="px-4 py-4 text-sm font-medium text-gold-300 transition-colors hover:bg-white/[0.03]"
          >
            Open full recipe
          </button>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 px-6 pb-6">
                {recipe.missing_ingredients.length > 0 && (
                  <div className="rounded-xl border border-gold-400/20 bg-gold-500/5 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold-300">
                      Missing ingredients
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.missing_ingredients.map((m) => (
                        <span key={m.name} className="text-xs text-white/60">
                          {m.quantity} {m.name}
                          {m !== recipe.missing_ingredients[recipe.missing_ingredients.length - 1] ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <ol className="space-y-3">
                  {recipe.steps.map((step) => (
                    <li key={step.step_number} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-300">
                        {step.step_number}
                      </span>
                      <p className="text-sm text-white/70">
                        {step.instruction}
                        {step.duration_minutes ? (
                          <span className="ml-2 text-xs text-emerald-300/70">
                            ({step.duration_minutes} min)
                          </span>
                        ) : null}
                      </p>
                    </li>
                  ))}
                </ol>

                <button
                  onClick={copyRecipe}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 transition-colors hover:border-emerald-400/40 hover:text-emerald-300"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy recipe"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
