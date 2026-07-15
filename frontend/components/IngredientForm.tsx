"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Wand2 } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import Button from "./ui/Button";
import IngredientTagInput from "./IngredientTagInput";
import { CUISINE_OPTIONS, DIETARY_OPTIONS, DIFFICULTY_OPTIONS } from "@/lib/utils";
import type { GenerateRecipesRequest } from "@/lib/types";

export default function IngredientForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (req: GenerateRecipesRequest) => void;
  submitting: boolean;
}) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState("Any");
  const [time, setTime] = useState(30);
  const [difficulty, setDifficulty] = useState("Any");
  const [servings, setServings] = useState(2);
  const [error, setError] = useState("");

  const toggleDietary = (d: string) => {
    setDietary((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const submit = () => {
    if (ingredients.length === 0) {
      setError("Add at least one ingredient to get started.");
      return;
    }
    setError("");
    onSubmit({
      ingredients,
      dietary_restrictions: dietary,
      cuisine,
      cooking_time_minutes: time,
      difficulty,
      servings,
    });
  };

  return (
    <section id="planner" className="relative mx-auto max-w-3xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl italic tracking-tight sm:text-5xl">
            What&rsquo;s in your <span className="text-gradient-emerald not-italic">kitchen</span>?
          </h2>
          <p className="mt-3 text-white/50">
            Add every ingredient you have on hand — we&rsquo;ll build the rest.
          </p>
        </div>

        <GlassCard strong tilt={false} className="p-6 sm:p-10">
          <div className="space-y-8">
            <div>
              <label className="mb-3 block text-sm font-medium text-white/70">
                Ingredients you have
              </label>
              <IngredientTagInput ingredients={ingredients} setIngredients={setIngredients} />
              {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-white/70">
                Dietary restrictions
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((d) => {
                  const active = dietary.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDietary(d)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        active
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-glow-emerald"
                          : "border-white/10 text-white/60 hover:border-white/25"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-medium text-white/70">Cuisine</label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
                >
                  {CUISINE_OPTIONS.map((c) => (
                    <option key={c} value={c} className="bg-void-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-white/70">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
                >
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <option key={d} value={d} className="bg-void-900">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label className="mb-3 flex justify-between text-sm font-medium text-white/70">
                  <span>Max cooking time</span>
                  <span className="text-emerald-300">{time} min</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-white/70">Servings</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 hover:border-emerald-400/50 hover:text-emerald-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-mono text-lg">{servings}</span>
                  <button
                    type="button"
                    onClick={() => setServings((s) => Math.min(12, s + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 hover:border-emerald-400/50 hover:text-emerald-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full !py-4 text-base"
              onClick={submit}
              disabled={submitting}
            >
              <Wand2 className="h-5 w-5" />
              {submitting ? "Cooking up ideas…" : "Generate 3 Recipes"}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
