"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { damping: 30, stiffness: 250, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 250, mass: 0.4 });

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;

    const move = (e: MouseEvent) => {
      setVisible(true);
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const hide = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
    };
  }, [x, y]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[999] h-72 w-72 rounded-full mix-blend-screen"
      style={{
        translateX: springX,
        translateY: springY,
        x: "-50%",
        y: "-50%",
        background:
          "radial-gradient(circle, rgba(34, 197, 125,0.16) 0%, rgba(220, 182, 85,0.08) 40%, transparent 70%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
