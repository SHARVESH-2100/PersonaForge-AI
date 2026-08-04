# Backend — PersonaForge AI

FastAPI service that powers persona generation, market simulation, risk analysis and report
generation. It talks to MongoDB (with an automatic local-file fallback) and Google Gemini.

Start it from the **repository root** so that the `backend` package resolves:

```bash
uvicorn main:app --reload --port 8001
```

Interactive API docs: <http://127.0.0.1:8001/docs>

## Layout

```
backend/
├── ai/            # Gemini prompts + generators (persona, simulation, risk, feedback)
├── api/           # APIRouter + route modules
│   └── Routes/
├── database/      # Mongo connection, collections, file-based local store
├── models/        # Internal domain models
├── schemas/       # Pydantic request/response models
├── services/      # Business logic used by the routes
├── utils/         # Helpers and constants
├── config.py      # Pydantic settings (reads ../.env, then .env)
└── requirements.txt
```

## Endpoints

| Method | Path                              | Description                                   |
| ------ | --------------------------------- | --------------------------------------------- |
| GET    | `/health`                         | Database health check (`connected` / `local-store`) |
| GET    | `/products/`                      | List products                                 |
| POST   | `/products/`                      | Create a product                              |
| DELETE | `/products/{product_id}`          | Delete a product                              |
| POST   | `/products/{product_id}/validate` | Run validation on a product                   |
| GET    | `/products/{product_id}/report`   | Fetch or generate the product report          |
| POST   | `/products/{product_id}/simulate` | Run a market simulation for a product         |
| GET    | `/personas/`                      | List personas                                 |
| POST   | `/personas/`                      | Create a persona                              |
| GET    | `/reports/`                       | List reports                                  |
| POST   | `/reports/`                       | Create a report                               |
| POST   | `/analyze/`                       | Send a free-form prompt to Gemini             |

## Configuration

Values are read from environment variables, then from `.env` at the repository root, then from
`backend/.env`. See the root [README](../README.md#configuration) and `.env.example`.

| Variable          | Required | Default                     |
| ----------------- | -------- | --------------------------- |
| `MONGODB_URI`     | no       | `mongodb://localhost:27017` |
| `DATABASE_NAME`   | no       | `personaforge_ai`           |
| `GEMINI_API_KEY`  | for AI   | –                           |

Create your own key at <https://aistudio.google.com/app/apikey> — none is bundled with the repo.
Without it the API still starts, but the Gemini-backed routes fail.
| `ALLOWED_ORIGINS` | no       | `["*"]`                     |
| `LOG_LEVEL`       | no       | `INFO`                      |

If MongoDB cannot be reached, the API starts in **degraded mode** and serves everything from a
file-based store at `backend/.localdb/`, so demos work offline.
