"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const Canvas = dynamic(() => import("@react-three/fiber").then((m) => m.Canvas), { ssr: false });
const HeroSceneContent = dynamic(() => import("./HeroSceneContent"), { ssr: false });

const STATIC_ICONS = ["🥑", "🍅", "🧄", "🍄", "🫑", "🌿"];

function StaticFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="h-52 w-52 rounded-full bg-gradient-to-br from-verdant/20 to-saffron/10 blur-2xl" />
      <div className="absolute grid grid-cols-3 gap-6 text-4xl opacity-80">
        {STATIC_ICONS.map((icon) => (
          <span key={icon}>{icon}</span>
        ))}
      </div>
    </div>
  );
}

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-[380px] w-full sm:h-[460px] lg:h-[560px]"
    >
      {reducedMotion ? (
        <StaticFallback />
      ) : inView ? (
        <Suspense fallback={<StaticFallback />}>
          <Canvas camera={{ position: [0, 0, 6.5], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
            <HeroSceneContent />
          </Canvas>
        </Suspense>
      ) : (
        <StaticFallback />
      )}
    </motion.div>
  );
}
