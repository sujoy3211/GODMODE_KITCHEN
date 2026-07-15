export interface GenerateRecipesRequest {
  ingredients: string[];
  dietary_restrictions: string[];
  cuisine: string;
  cooking_time_minutes: number;
  difficulty: string;
  servings: number;
}

export interface NutritionInfo {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  key_vitamins: string[];
}

export interface ShoppingItem {
  name: string;
  quantity: string;
  reason: string;
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
  duration_minutes: number | null;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  difficulty: string;
  total_time_minutes: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  ingredients_used: string[];
  missing_ingredients: ShoppingItem[];
  steps: RecipeStep[];
  nutrition: NutritionInfo;
  tags: string[];
}

export interface RecipeGenerationResult {
  recipes: Recipe[];
  shopping_list: ShoppingItem[];
  chef_notes: string;
}

export interface FavoriteOut {
  id: number;
  recipe: Recipe;
  created_at: string;
}
