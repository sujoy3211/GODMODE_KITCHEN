import json
import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import init_db, get_db, FavoriteRecipe, SearchHistory
from models import (
    GenerateRecipesRequest,
    RecipeGenerationResult,
    FavoriteCreate,
)
from groq_service import generate_recipes

app = FastAPI(title="Nourish AI API", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "model": "llama-3.3-70b-versatile"}


@app.post("/api/generate-recipes", response_model=RecipeGenerationResult)
def generate(req: GenerateRecipesRequest, db: Session = Depends(get_db)):
    try:
        result = generate_recipes(req)
    except RuntimeError as e:
        # missing API key etc
        raise HTTPException(status_code=500, detail=str(e))
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502, detail="The AI returned malformed JSON. Please try again."
        )
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Recipe generation failed: {e}")

    db.add(SearchHistory(request_json=req.model_dump_json()))
    db.commit()

    return result


@app.get("/api/history")
def history(db: Session = Depends(get_db)):
    rows = db.query(SearchHistory).order_by(SearchHistory.id.desc()).limit(20).all()
    return [row.to_dict() for row in rows]


@app.post("/api/favorites")
def add_favorite(payload: FavoriteCreate, db: Session = Depends(get_db)):
    fav = FavoriteRecipe(
        recipe_json=payload.recipe.model_dump_json(),
        title=payload.recipe.title,
    )
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav.to_dict()


@app.get("/api/favorites")
def list_favorites(db: Session = Depends(get_db)):
    rows = db.query(FavoriteRecipe).order_by(FavoriteRecipe.id.desc()).all()
    return [row.to_dict() for row in rows]


@app.delete("/api/favorites/{favorite_id}")
def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    row = db.query(FavoriteRecipe).filter(FavoriteRecipe.id == favorite_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(row)
    db.commit()
    return {"deleted": favorite_id}
