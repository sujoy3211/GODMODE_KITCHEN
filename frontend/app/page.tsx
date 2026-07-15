"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AuroraBackground from "@/components/AuroraBackground";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IngredientForm from "@/components/IngredientForm";
import GenerationLoader from "@/components/GenerationLoader";
import RecipeResults from "@/components/RecipeResults";
import RecipeModal from "@/components/RecipeModal";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import FavoritesDrawer from "@/components/FavoritesDrawer";
import SuccessToast from "@/components/SuccessToast";
import ErrorToast from "@/components/ErrorToast";
import { generateRecipes, fetchFavorites, saveFavorite, deleteFavorite } from "@/lib/api";
import type { GenerateRecipesRequest, Recipe, RecipeGenerationResult, FavoriteOut } from "@/lib/types";

type Stage = "idle" | "loading" | "results" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<RecipeGenerationResult | null>(null);
  const [error, setError] = useState("");
  const [lastRequest, setLastRequest] = useState<GenerateRecipesRequest | null>(null);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteOut[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchFavorites()
      .then(setFavorites)
      .catch(() => {
        /* backend not running yet — fine, user will see it when they submit */
      });
  }, []);

  const scrollToPlanner = () => {
    document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
  };

  const runGeneration = useCallback(async (req: GenerateRecipesRequest) => {
    setStage("loading");
    setError("");
    setLastRequest(req);
    const minLoaderMs = 6600; // let the multi-stage animation play out fully
    const started = Date.now();
    try {
      const data = await generateRecipes(req);
      const elapsed = Date.now() - started;
      if (elapsed < minLoaderMs) {
        await new Promise((r) => setTimeout(r, minLoaderMs - elapsed));
      }
      setResult(data);
      setStage("results");
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e: any) {
      const msg = e.message || "Something went wrong generating your recipes.";
      setError(msg);
      setStage("error");
      setToast({ type: "error", message: msg });
    }
  }, []);

  const handleSave = async (recipe: Recipe) => {
    try {
      const fav = await saveFavorite(recipe);
      setFavorites((f) => [fav, ...f]);
      setToast({ type: "success", message: `"${recipe.title}" saved to favorites` });
    } catch {
      setToast({ type: "error", message: "Couldn't save — check the backend connection." });
    }
  };

  const handleDelete = async (id: number) => {
    setFavorites((f) => f.filter((x) => x.id !== id));
    try {
      await deleteFavorite(id);
    } catch {
      /* ignore */
    }
  };

  const savedIds = new Set(favorites.map((f) => f.recipe.id));

  return (
    <main className="relative">
      <LoadingScreen />
      <AuroraBackground />
      <Navbar onOpenFavorites={() => setFavoritesOpen(true)} favoritesCount={favorites.length} />

      <div className="relative z-10">
        <Hero onStart={scrollToPlanner} />

        <IngredientForm onSubmit={runGeneration} submitting={stage === "loading"} />

        <div id="results">
          <AnimatePresence mode="wait">
            {stage === "loading" && (
              <motion.div key="loading" exit={{ opacity: 0 }}>
                <GenerationLoader />
              </motion.div>
            )}

            {stage === "results" && result && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <RecipeResults
                  result={result}
                  onSave={handleSave}
                  savedIds={savedIds}
                  onOpenModal={setActiveRecipe}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <HowItWorks />
        <Footer />
      </div>

      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onDelete={handleDelete}
      />

      <RecipeModal
        recipe={activeRecipe}
        onClose={() => setActiveRecipe(null)}
        onSave={handleSave}
        saved={activeRecipe ? savedIds.has(activeRecipe.id) : false}
      />

      <SuccessToast
        message={toast?.type === "success" ? toast.message : ""}
        visible={toast?.type === "success"}
        onDone={() => setToast(null)}
      />
      <ErrorToast
        message={toast?.type === "error" ? toast.message : ""}
        visible={toast?.type === "error"}
        onRetry={lastRequest ? () => runGeneration(lastRequest) : undefined}
        onClose={() => setToast(null)}
      />
    </main>
  );
}
