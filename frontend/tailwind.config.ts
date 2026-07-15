import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#08090A",
        char: "#0E1512",
        bone: "#F3F1EA",
        smoke: "#8B9490",
        verdant: {
          DEFAULT: "#22C57D",
          deep: "#0F6B44",
        },
        saffron: "#D6A253",
        void: {
          950: "#08090A",
          900: "#0a0c0a",
          800: "#0f1310",
          700: "#171d18",
        },
        emerald: {
          50: "#e9fbf1",
          200: "#a8f0cb",
          400: "#3fd88a",
          500: "#1fbf72",
          600: "#149a5c",
          900: "#0a3524",
        },
        gold: {
          200: "#f3e3b3",
          300: "#e8cd82",
          400: "#dcb655",
          500: "#D6A253",
        },
        glass: "rgba(255, 255, 255, 0.06)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "aurora-1": "radial-gradient(circle at 20% 20%, rgba(34, 197, 125,0.35), transparent 55%)",
        "aurora-2": "radial-gradient(circle at 80% 30%, rgba(220, 182, 85,0.25), transparent 50%)",
        "aurora-3": "radial-gradient(circle at 50% 80%, rgba(34, 197, 125,0.18), transparent 55%)",
        "grain": "url('/noise.svg')",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glow-emerald": "0 0 40px rgba(34, 197, 125,0.35)",
        "glow-gold": "0 0 40px rgba(220, 182, 85,0.25)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 14s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        drift: "drift 30s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-22px) rotate(4deg)" },
        },
        drift: {
          "0%": { transform: "translate(0,0) rotate(0deg)" },
          "100%": { transform: "translate(-40px,-30px) rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
