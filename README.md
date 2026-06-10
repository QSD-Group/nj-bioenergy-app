# nj-bioenergy-app — NJ Bioenergy Calculator (Frontend)

This repository is the **frontend** (browser UI) for the New Jersey Bioenergy
Calculator — a static HTML/CSS/JS site with **no build step**.

- **Frontend (this repo):** `nj-bioenergy-app` — hosted on Vercel at
  https://nj-bioenergy.apps.qsdsan.com
- **Backend:** [`nj-bioenergy-api`](https://github.com/QSD-Group/nj-bioenergy-api) —
  the FastAPI service this site calls, at https://api.qsdsan.app

`env.js` sets `API_BASE_URL` (the backend origin) at runtime; it is committed because
the URL is public. See `CLAUDE.md` for the architecture and the full API contract.

## Local development

```bash
python -m http.server 8000   # then open http://localhost:8000
```

## Deploy

Hosted on Vercel as a static site (framework preset "Other", root directory `/`, no
build command). Pushing to the default branch triggers a deploy.
