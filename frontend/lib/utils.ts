import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const INGREDIENT_SUGGESTIONS = [
  "Chicken breast",
  "Eggs",
  "Rice",
  "Spinach",
  "Garlic",
  "Onion",
  "Tomato",
  "Olive oil",
  "Chickpeas",
  "Paneer",
  "Salmon",
  "Basil",
  "Lemon",
  "Bell pepper",
  "Tofu",
];

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Low-Carb",
  "Nut-Free",
  "Halal",
];

export const CUISINE_OPTIONS = [
  "Any",
  "Italian",
  "Indian",
  "Japanese",
  "Mexican",
  "Thai",
  "Mediterranean",
  "French",
  "Bengali",
];

export const DIFFICULTY_OPTIONS = ["Any", "Easy", "Medium", "Hard"];
