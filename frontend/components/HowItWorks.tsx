"use client";

import { motion } from "framer-motion";
import { ListChecks, Sparkles, ChefHat } from "lucide-react";
import GlassCard from "./ui/GlassCard";

const STEPS = [
  {
    icon: ListChecks,
    title: "Tell us what you have",
    body: "List your ingredients, dietary needs, cuisine, time, and servings.",
  },
  {
    icon: Sparkles,
    title: "AI plans the meal",
    body: "Llama 3.3 70B on Groq drafts three distinct recipes with full nutrition, in seconds.",
  },
  {
    icon: ChefHat,
    title: "Cook with confidence",
    body: "Follow clear steps, save favorites, and get a shopping list for anything missing.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center font-display text-4xl italic tracking-tight sm:text-5xl"
      >
        How it <span className="text-gradient-gold not-italic">works</span>
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard className="h-full p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-gold-400/10 text-emerald-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl italic">{step.title}</h3>
                <p className="mt-2 text-sm text-white/55">{step.body}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
