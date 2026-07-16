"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Intersection Observer to start animations only when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const floatTransition = {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="relative flex h-[380px] w-full max-w-lg items-center justify-center sm:h-[460px] lg:h-[560px] mx-auto"
    >
      {/* --- Background Ambient Glow --- */}
      <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-verdant/5 blur-[100px]" />

      {/* --- Layer 1: Cilantro (Background) --- */}
      <motion.div
        className="absolute -left-5 top-1/4 z-0"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ ...floatTransition, delay: 0.5 }}
      >
        <Image src="/hero_cilantro.png" alt="Fresh Cilantro" width={180} height={180} className="drop-shadow-xl" priority />
      </motion.div>

      {/* --- Layer 2: Pepper (Foreground) --- */}
      <motion.div
        className="absolute -right-2 top-1/3 z-20"
        animate={{ y: [0, -15, 0], rotate: [0, -8, 0] }}
        transition={floatTransition}
      >
        <Image src="/hero_pepper.png" alt="Red Bell Pepper" width={200} height={200} className="drop-shadow-2xl" priority />
      </motion.div>

      {/* --- Layer 3: Lime (Midground) --- */}
      <motion.div
        className="absolute -bottom-10 left-10 z-10"
        animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
        transition={{ ...floatTransition, delay: 1 }}
      >
        <Image src="/hero_lime.png" alt="Lime Wedge" width={140} height={140} className="drop-shadow-xl" priority />
      </motion.div>
    </motion.div>
  );
}