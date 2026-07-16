"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import RecipeCard from "./RecipeCard";
import ShoppingList from "./ShoppingList";
import type { Recipe, RecipeGenerationResult } from "@/lib/types";

export default function RecipeResults({
  result,
  onSave,
  savedIds,
  onOpenModal,
}: {
  result: RecipeGenerationResult;
  onSave: (r: Recipe) => void;
  savedIds: Set<string>;
  onOpenModal: (r: Recipe) => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="font-display text-4xl italic tracking-tight sm:text-5xl">
          Three ways to <span className="text-gradient-emerald not-italic">PetPooja</span> tonight
        </h2>
        {result.chef_notes && (
          <p className="mx-auto mt-4 flex max-w-2xl items-start gap-2 text-sm text-white/50">
            <Quote className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
            {result.chef_notes}
          </p>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {result.recipes.map((recipe, i) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            index={i}
            onSave={onSave}
            saved={savedIds.has(recipe.id)}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>

      <div className="mt-10">
        <ShoppingList items={result.shopping_list} />
      </div>
    </section>
  );
}
