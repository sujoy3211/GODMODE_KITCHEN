import type { Metadata } from "next";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
// Suppress TypeScript error for side-effect CSS import in environments
// where global CSS type declarations aren't present.
// @ts-ignore: Unable to find type declarations for './globals.css'
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PetPooja AI — Your Ingredients. Your Personal AI Chef.",
  description:
    "Tell PetPooja AI what's in your kitchen and it plans three complete recipes, full nutrition, and a shopping list for what's missing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-obsidian text-bone font-body antialiased selection:bg-verdant/30 selection:text-verdant">
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}