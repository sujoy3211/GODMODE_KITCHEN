"""
Pydantic schemas shared across the API.

These double as the contract we hand to Groq: the model is instructed to
return JSON that validates against RecipeGenerationResult.
"""
from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request coming from the frontend form
# ---------------------------------------------------------------------------

class GenerateRecipesRequest(BaseModel):
    ingredients: List[str] = Field(..., min_length=1, description="Ingredients the user already has")
    dietary_restrictions: List[str] = Field(default_factory=list)
    cuisine: Optional[str] = Field(default="Any")
    cooking_time_minutes: int = Field(default=30, ge=5, le=180)
    difficulty: str = Field(default="Any")  # Easy | Medium | Hard | Any
    servings: int = Field(default=2, ge=1, le=12)


# ---------------------------------------------------------------------------
# Structured recipe payload the model must return
# ---------------------------------------------------------------------------

class NutritionInfo(BaseModel):
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    key_vitamins: List[str] = Field(default_factory=list)


class ShoppingItem(BaseModel):
    name: str
    quantity: str
    reason: str = ""  # e.g. "needed for the sauce"


class RecipeStep(BaseModel):
    step_number: int
    instruction: str
    duration_minutes: Optional[int] = None


class Recipe(BaseModel):
    id: str
    title: str
    description: str
    cuisine: str
    difficulty: str
    total_time_minutes: int
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    ingredients_used: List[str]
    missing_ingredients: List[ShoppingItem]
    steps: List[RecipeStep]
    nutrition: NutritionInfo
    tags: List[str] = Field(default_factory=list)


class RecipeGenerationResult(BaseModel):
    recipes: List[Recipe]
    shopping_list: List[ShoppingItem]
    chef_notes: str = ""


# ---------------------------------------------------------------------------
# Favorites persistence
# ---------------------------------------------------------------------------

class FavoriteCreate(BaseModel):
    recipe: Recipe


class FavoriteOut(BaseModel):
    id: int
    recipe: Recipe
    created_at: str

    class Config:
        from_attributes = True
