# Lyon's Den — Forever Athlete App

Member-facing app for Lyon's Den (fitness/lifestyle club): bookings for classes/courts/youth
programs, shop for apparel, memberships, workout log (wearable-sync placeholder), and a
points/rewards system.

## Stack
- `backend/`: Node 22 + Express + better-sqlite3 (file DB at `backend/data/lyonsden.db`, seeded
  automatically on first boot if empty). No external services/credentials required.
- `frontend/`: React + Vite + Tailwind, dark "Lyon's Den" theme (black/charcoal + orange accent).
  Talks to the backend via `VITE_API_URL` (separate-origin wiring, backend has CORS enabled for
  the frontend's public origin).

## Dev notes
- There is a single demo member (id=1, "Alex Rivera") seeded on boot — the app has no login
  screen; it represents "the logged-in member" using the ecosystem.
- Wearable connections (Apple Health / Fitbit / Garmin / Whoop) are UI-only mocks — no real OAuth
  integration exists. Workouts are logged manually via a form that simulates a wearable sync.
- Run `docker compose -f docker-compose.base44.yml ps` and `curl localhost:3000` /
  `curl localhost:8000/api/health` to verify both services.
- Both services run their dev servers from the mounted source (`node --watch` for the API, Vite
  dev server for the frontend) — edits hot-reload without rebuilding images.
