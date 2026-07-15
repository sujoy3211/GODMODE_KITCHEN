import type { GenerateRecipesRequest, RecipeGenerationResult, FavoriteOut, Recipe } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function generateRecipes(
  payload: GenerateRecipesRequest
): Promise<RecipeGenerationResult> {
  const res = await fetch(`${API_URL}/api/generate-recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<RecipeGenerationResult>(res);
}

export async function fetchFavorites(): Promise<FavoriteOut[]> {
  const res = await fetch(`${API_URL}/api/favorites`);
  return handle<FavoriteOut[]>(res);
}

export async function saveFavorite(recipe: Recipe): Promise<FavoriteOut> {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe }),
  });
  return handle<FavoriteOut>(res);
}

export async function deleteFavorite(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/favorites/${id}`, { method: "DELETE" });
  await handle(res);
}
