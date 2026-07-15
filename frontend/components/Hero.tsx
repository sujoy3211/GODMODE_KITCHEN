"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Play } from "lucide-react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import ParticleNetwork from "./ParticleNetwork";
import HeroVisual from "./HeroVisual";
import StatCards from "./StatCards";

const headline = "PetPooja".split(" ");
const headline2 = "Your AI Chef.".split(" ");

const wordVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { delay: 0.5 + i * 0.09, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 lg:px-16">
      <ParticleNetwork />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* left: copy */}
        <div className="relative z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex justify-center lg:justify-start"
          >
            <Badge tone="emerald" className="mb-8">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Powered by Llama 3.3 70B on Groq
            </Badge>
          </motion.div>

          <h1 className="font-display text-5xl leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden">
              {headline.map((w, i) => (
                <motion.span
                  key={w}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block pr-3"
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden italic">
              {headline2.map((w, i) => (
                <motion.span
                  key={w}
                  custom={i + headline.length}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-gradient-emerald inline-block pr-3"
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mx-auto mt-7 max-w-xl text-balance text-lg text-smoke sm:text-xl lg:mx-0"
          >
            List what&rsquo;s already in your kitchen. PetPooja AI designs three complete
            recipes, full nutrition, and a shopping list for anything you&rsquo;re missing —
            in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button variant="primary" onClick={onStart}>
              Start Cooking
            </Button>
          </motion.div>
        </div>

        {/* right: 3D glass bowl + orbiting ingredients */}
        <div className="relative z-10">
          <HeroVisual />
          <StatCards />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-smoke"
      >
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}