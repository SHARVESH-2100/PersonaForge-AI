# PersonaForge AI

**Product-launch intelligence: generate customer personas, simulate the market, and de-risk go-to-market decisions.**

A **hackathon project** that turns a product idea into evidence. Give it a product description and
it generates AI customer personas, runs market simulations, scores risks and produces a
recommendation report — all rendered in a React dashboard.

> 🏆 Built during a hackathon. The goal was a working end-to-end demo: idea → personas → simulation →
> recommendation → downloadable validation report.

---

## The problem

Most product launches fail on assumptions, not engineering: teams guess who the customer is, what
they would pay, and which features matter. PersonaForge replaces those guesses with generated,
inspectable evidence — personas with behaviours and pain points, simulated purchase intent, pricing
and segment reactions, competitor positioning, and a launch verdict with risks called out.

---

## What it does

| Stage | Capability |
| --- | --- |
| **Product intake** | Create a product with description, category and target market |
| **Persona generation** | AI-generated customer personas with demographics, goals, pain points and channels |
| **Simulation** | Market simulation across segments: purchase intent, pricing sensitivity, feature demand |
| **Scenario lab** | Change price, audience and launch parameters and watch predictions move |
| **Risk analysis** | Flags positioning, pricing and demand risks with severity |
| **Recommendations** | Ranked, data-backed actions for the launch |
| **Validation report** | Consolidated executive summary, insights and exportable report |
| **Demo mode** | Fully populated walkthrough that needs no API key |

### Front-end screens

Mission Control · Persona Generation · Persona Galaxy · Simulation Engine · Scenario Lab ·
Intelligence Dashboard · AI Recommendations · Final Validation Report · Demo Mode

---

## Architecture

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  React + Vite front end      │  HTTP  │  FastAPI backend             │
│  (Tailwind, Framer Motion,   │ ─────► │  /products /personas         │
│   Three.js, Recharts)        │        │  /reports  /analyze /health  │
└──────────────────────────────┘        └───────────────┬──────────────┘
                                                        │
                                    ┌───────────────────┼───────────────────┐
                                    ▼                   ▼                   ▼
                             Google Gemini        MongoDB            Local JSON store
                             (persona, sim,       (products,         (automatic fallback
                              risk, report)        personas,          when MongoDB is
                                                   reports)           unavailable)
```

The backend degrades gracefully: if MongoDB is unreachable it serves everything from
`backend/.localdb/`, so demos work offline and nothing crashes.

---

## Tech stack

**Backend** — Python · FastAPI · Uvicorn · Pydantic v2 · PyMongo · Google Gemini (`google-generativeai`)
**Frontend** — React 19 · Vite · Tailwind CSS 4 · Framer Motion · GSAP · Three.js / React Three Fiber ·
Recharts · React Router · Axios

---

## Project structure

```
PERSONAFORGE AI/
├── main.py                 # FastAPI app, CORS, error handlers, startup/shutdown
├── config.py               # legacy root settings shim (unused — see backend/config.py)
├── backend/
│   ├── ai/                 # Gemini prompts + persona/simulation/risk/feedback generators
│   ├── api/                # APIRouter and route modules
│   ├── database/           # Mongo connection, collections, local JSON fallback
│   ├── models/             # Internal domain models
│   ├── schemas/            # Pydantic request/response models
│   ├── services/           # Business logic
│   ├── utils/              # Helpers and constants
│   ├── config.py           # Settings (reads ../.env, then .env)
│   └── requirements.txt
├── frontend/
│   ├── src/pages/          # Mission Control, Persona Galaxy, Scenario Lab, ...
│   ├── src/components/     # Shell, dashboard, persona, phase7-9, charts
│   ├── package.json
│   └── .env.example
├── .env.example
└── LICENSE
```

---

## Quick start

### 1. Backend

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

pip install -r backend/requirements.txt

copy .env.example .env          # Windows
# cp .env.example .env          # macOS / Linux
# then paste your own Gemini API key into .env (see Configuration)

uvicorn main:app --reload --port 8001
```

API docs: <http://127.0.0.1:8001/docs> · Health: <http://127.0.0.1:8001/health>

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local    # optional; defaults to http://127.0.0.1:8001
npm run dev
```

Open <http://localhost:5173>.

> No MongoDB and no API key? The API still starts in degraded mode and the UI's **Demo Mode** works
> entirely from bundled mock data.

---

## Configuration

`.env` at the repository root (git-ignored):

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `MONGODB_URI` | no | `mongodb://localhost:27017` | Mongo connection string |
| `DATABASE_NAME` | no | `personaforge_ai` | Database name |
| `GEMINI_API_KEY` | for AI features | – | Google Gemini key — **create your own**, see below |
| `ALLOWED_ORIGINS` | no | `["*"]` | CORS origins for the frontend |
| `LOG_LEVEL` | no | `INFO` | Backend logging level |

### Getting a Gemini API key (create your own)

**No API key is bundled with this repository.** You need your own free key to use the AI features:

1. Open <https://aistudio.google.com/app/apikey>.
2. Sign in with your Google account.
3. Click **Create API key** and copy the value.
4. Paste it into your local `.env`:

   ```ini
   GEMINI_API_KEY=your_key_here
   ```

5. Restart the backend.

Notes:

- The free tier is enough for demos and development.
- Model used: `gemini-3-flash-preview` (see `backend/ai/gemini.py`).
- Never commit `.env` — it is already listed in `.gitignore`.
- Without a key the backend still starts; it logs a warning and the Gemini-backed routes fail.
  **Demo Mode** in the UI keeps working from bundled mock data.

Frontend (`frontend/.env.local`):

| Variable | Default |
| --- | --- |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8001` |

---

## API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Database status (`connected` or `local-store`) |
| GET | `/products/` | List products |
| POST | `/products/` | Create a product |
| DELETE | `/products/{id}` | Delete a product |
| POST | `/products/{id}/validate` | Validate a product |
| POST | `/products/{id}/simulate` | Run a market simulation |
| GET | `/products/{id}/report` | Get or generate the report |
| GET / POST | `/personas/` | List / create personas |
| GET / POST | `/reports/` | List / create reports |
| POST | `/analyze/` | Free-form Gemini prompt |

---

## Limitations

- Persona and simulation outputs are **AI-generated estimates**, not market research — do not treat
  them as validated demand.
- Gemini features require an API key and network access; Demo Mode is the offline path.
- Authentication/multi-user accounts are out of scope for the hackathon build.
- The local JSON store is single-instance and intended for demos only.

---

## License

MIT — see [LICENSE](LICENSE).
