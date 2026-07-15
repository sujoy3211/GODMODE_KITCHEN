"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Heart } from "lucide-react";
import Button from "./ui/Button";

export default function Navbar({
  onOpenFavorites,
  favoritesCount,
}: {
  onOpenFavorites: () => void;
  favoritesCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <motion.nav
        animate={{
          maxWidth: scrolled ? 640 : 880,
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`glass-panel flex w-full items-center justify-between rounded-full px-5 transition-shadow duration-500 ${
          scrolled ? "shadow-[0_0_30px_rgba(34, 197, 125,0.18)] border-verdant/20" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-verdant to-verdant-deep shadow-[0_0_24px_rgba(34, 197, 125,0.4)]"
          >
            <ChefHat className="h-5 w-5 text-obsidian" strokeWidth={2.4} />
          </motion.div>
          <span className="font-display text-lg tracking-tight">PetPooja AI</span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-smoke md:flex">
          {[
            { label: "Planner", href: "#planner" },
            { label: "How it works", href: "#how-it-works" },
          ].map((link) => (
            <a key={link.href} href={link.href} className="group relative py-1 transition-colors hover:text-verdant">
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-verdant transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <Button variant="outline" magnetic={false} onClick={onOpenFavorites} className="!px-4 !py-2 text-sm">
          <Heart className="h-4 w-4" />
          Favorites
          {favoritesCount > 0 && (
            <span className="ml-1 rounded-full bg-verdant px-1.5 py-0.5 text-[10px] font-bold text-obsidian">
              {favoritesCount}
            </span>
          )}
        </Button>
      </motion.nav>
    </motion.header>
  );
}