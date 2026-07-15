import { cn } from "@/lib/utils";

export default function Badge({
  children,
  tone = "emerald",
  className,
}: {
  children: React.ReactNode;
  tone?: "emerald" | "gold" | "neutral";
  className?: string;
}) {
  const tones = {
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
    gold: "bg-gold-500/10 text-gold-300 border-gold-400/30",
    neutral: "bg-white/5 text-white/70 border-white/10",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
