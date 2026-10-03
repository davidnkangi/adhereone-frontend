# AdhereOne — Frontend (Phase 1)

React + Vite + Tailwind. Talks to the Django backend via JWT.

## Pages

- **Login** — authenticates against `/api/auth/login/`
- **Overview** — compliance % across all active assessments
- **Assessments** — list, then a findings register per assessment with
  inline status editing and a "Generate Audit Package" action
- **Asset Inventory** — the asset register, with an ePHI/CUI scope filter
- **Evidence** — uploaded files with expiration flags
- **Audit Packages** — list of frozen snapshots generated so far

## Local setup

1. `npm install`
2. `cp .env.example .env.local` — leave `VITE_API_BASE_URL` blank for local
   dev; the Vite dev server proxies `/api` to `http://localhost:8000`
   (your locally running Django backend)
3. `npm run dev` — opens at http://localhost:5173

Log in with the superuser you created via:
```
python manage.py tenant_command createsuperuser --schema=demo_client
```
(on the backend, running against that same tenant)

## Deploying

Because this platform is multi-tenant with each client on its own
subdomain, the frontend needs to know which tenant's API to talk to.
Two common approaches once you're past the demo stage:

1. **One frontend build, subdomain-aware at runtime** — detect
   `window.location.hostname` and derive the API base from it
   (e.g. `demo.adhereintelligence.com` → API at the same host's `/api`).
   This is the better long-term approach once your React app is served
   from the same subdomain as its tenant.
2. **Static hosting per environment** — for now (single demo tenant),
   just set `VITE_API_BASE_URL` at build time and deploy the `dist/`
   folder to Render as a Static Site, Vercel, or Netlify.

We'll wire up proper subdomain-aware routing when we tackle real domain
routing next, as discussed.
