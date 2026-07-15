# Nourish AI

> "Your Ingredients. Your Personal AI Chef."

A full-stack AI meal planner. You list the ingredients you already have, your
dietary restrictions, cuisine, cooking time, difficulty, and servings —
Nourish AI (running on **Groq's Llama 3.3 70B**) generates 3 complete recipes
with step-by-step instructions, full nutrition estimates, and a shopping list
for anything you're missing. Favorite recipes are saved to a local SQLite
database.

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Three.js / React Three Fiber, canvas-confetti
- **Backend:** FastAPI, Python, Groq SDK, SQLite (SQLAlchemy)

### What's new in this version

- Cinematic loading screen on first load
- 3D animated glass bowl hero with orbiting ingredients and rising particles (React Three Fiber), with a static reduced-motion fallback
- Mouse-reactive particle constellation background
- Floating stat cards, scroll-shrinking glass navbar with animated underline
- Neural-network-style "AI thinking" animation with cycling status text
- Full-screen recipe detail modal with animated ingredient checklist, steps that reveal one by one, share/download/save
- Confetti success toast on save, shake + glow error toast with retry

---

## 1. Get a Groq API key

Sign up / log in at **https://console.groq.com/keys** and create a key
(starts with `gsk_...`). It's free to start.

## 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# open .env and paste your GROQ_API_KEY

uvicorn main:app --reload --port 8000
```

The API is now running at `http://localhost:8000`. Check `http://localhost:8000/api/health`.

A `nourish.db` SQLite file is created automatically on first run — this stores
your favorites and search history.

## 3. Frontend setup

In a **second terminal**:

```bash
cd frontend
npm install

cp .env.local.example .env.local
# defaults to NEXT_PUBLIC_API_URL=http://localhost:8000 — fine for local dev

npm run dev
```

Open **http://localhost:3000** — that's the app.

## 4. Using it

1. Scroll to the planner (or click "Generate Recipes" in the hero).
2. Add your ingredients (type + Enter, or click a suggestion chip).
3. Pick dietary restrictions, cuisine, max cooking time, difficulty, servings.
4. Click **Generate 3 Recipes** — watch the multi-stage AI thinking animation,
   then review 3 recipes with animated nutrition rings, expandable steps, and
   a combined shopping list.
5. Tap the heart on any recipe to save it — open **Favorites** in the navbar
   to view or remove saved recipes (persisted server-side in SQLite).

## Project structure

```
nourish-ai/
├── backend/
│   ├── main.py           # FastAPI routes
│   ├── models.py         # Pydantic request/response + Groq JSON schema
│   ├── groq_service.py   # Groq chat completion call, structured JSON output
│   ├── database.py       # SQLite models (favorites, search history)
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── layout.tsx    # fonts, metadata
    │   ├── page.tsx       # state machine: hero → form → loading → results
    │   └── globals.css
    ├── components/
    │   ├── Hero.tsx, AuroraBackground.tsx, CursorGlow.tsx
    │   ├── IngredientForm.tsx, IngredientTagInput.tsx
    │   ├── GenerationLoader.tsx
    │   ├── RecipeCard.tsx, RecipeResults.tsx, NutritionRing.tsx
    │   ├── ShoppingList.tsx, FavoritesDrawer.tsx
    │   ├── HowItWorks.tsx, Navbar.tsx, Footer.tsx
    │   └── ui/ (Button, Badge, GlassCard)
    └── lib/ (api.ts, types.ts, utils.ts)
```

## Notes

- **Never commit `backend/.env`** — it holds your real Groq API key. Only
  `.env.example` is checked in.
- If recipe generation fails, the UI will tell you to check that the backend
  is running and `GROQ_API_KEY` is set — check the FastAPI terminal for the
  actual error too.
- The hero fonts (Fraunces, Manrope, JetBrains Mono) load from Google Fonts at
  build time via `next/font/google` — this requires normal internet access
  when you run `npm run build` / `npm run dev`.
- Deploying: the frontend can go on Vercel; the backend can go on Render,
  Railway, Fly.io, or any host that runs FastAPI. Set `NEXT_PUBLIC_API_URL` on
  the frontend to your deployed backend URL, and `CORS_ORIGINS` on the backend
  to your deployed frontend URL.
