"""
Wraps the Groq chat completion call.

We constrain the model to a strict JSON schema (via prompt + response_format
json_object + Pydantic validation on the way out) so the frontend can render
recipes, nutrition, and a shopping list without any brittle string parsing.
"""
import json
import os
import uuid

from groq import Groq
from models import GenerateRecipesRequest, RecipeGenerationResult

MODEL = "llama-3.3-70b-versatile"

_client: Groq | None = None


def get_client() -> Groq:
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Copy backend/.env.example to backend/.env "
                "and paste your key from https://console.groq.com/keys"
            )
        _client = Groq(api_key=api_key)
    return _client


SYSTEM_PROMPT = """You are Nourish AI, an award winning private chef and registered \
dietitian. You design precise, delicious recipes strictly from the ingredients a \
home cook already has, adding only a short, clearly labelled shopping list for what \
is missing. You always honor dietary restrictions exactly (never suggest an \
ingredient that violates one). You always return ONLY valid JSON matching the exact \
schema you are given -- no markdown fences, no commentary, no trailing text.

Nutrition numbers must be realistic estimates for the given serving size (not the \
whole dish). For each recipe, provide a highly detailed, comprehensive, step-by-step cooking guide. You MUST break the instructions down into at least 8 to 12 distinct steps. Do NOT summarize or group steps together. Explicitly detail the required heat levels, exact cooking times, and visual/aromatic cues so the user knows exactly when an ingredient is perfectly cooked \
instruction. Recipes should meaningfully differ from each other in flavor profile \
or technique, not just seasoning."""


def _build_user_prompt(req: GenerateRecipesRequest) -> str:
    schema_example = {
        "recipes": [
            {
                "id": "string, a short kebab-case slug unique within this response",
                "title": "string",
                "description": "one enticing sentence",
                "cuisine": "string",
                "difficulty": "Easy | Medium | Hard",
                "total_time_minutes": "int",
                "prep_time_minutes": "int",
                "cook_time_minutes": "int",
                "servings": "int",
                "ingredients_used": ["ingredients from the user's list actually used"],
                "missing_ingredients": [
                    {"name": "string", "quantity": "string", "reason": "short phrase"}
                ],
                "steps": [
                    {"step_number": 1, "instruction": "string", "duration_minutes": "int or null"}
                ],
                "nutrition": {
                    "calories": "int, per serving",
                    "protein_g": "float, per serving",
                    "carbs_g": "float, per serving",
                    "fat_g": "float, per serving",
                    "fiber_g": "float, per serving",
                    "key_vitamins": ["e.g. Vitamin C, Iron"],
                },
                "tags": ["e.g. high-protein, quick, one-pan"],
            }
        ],
        "shopping_list": [
            {"name": "string", "quantity": "string", "reason": "which recipe(s) need it"}
        ],
        "chef_notes": "one short paragraph of encouraging, practical advice",
    }

    return f"""Generate EXACTLY 3 distinct recipes as JSON matching this schema:
{json.dumps(schema_example, indent=2)}

User's available ingredients: {", ".join(req.ingredients)}
Dietary restrictions: {", ".join(req.dietary_restrictions) or "None"}
Preferred cuisine: {req.cuisine or "Any"}
Max total cooking time: {req.cooking_time_minutes} minutes
Difficulty preference: {req.difficulty or "Any"}
Servings needed: {req.servings}

The top level "shopping_list" field must be the de-duplicated union of every \
recipe's missing_ingredients. Return ONLY the JSON object, nothing else."""


def generate_recipes(req: GenerateRecipesRequest) -> RecipeGenerationResult:
    client = get_client()

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_prompt(req)},
        ],
        temperature=0.8,
        max_tokens=4096,
        response_format={"type": "json_object"},
    )

    raw = completion.choices[0].message.content
    data = json.loads(raw)

    # Guarantee every recipe has a stable unique id even if the model slips.
    seen_ids = set()
    for recipe in data.get("recipes", []):
        rid = recipe.get("id") or str(uuid.uuid4())[:8]
        if rid in seen_ids:
            rid = f"{rid}-{uuid.uuid4().hex[:4]}"
        seen_ids.add(rid)
        recipe["id"] = rid

    return RecipeGenerationResult.model_validate(data)
