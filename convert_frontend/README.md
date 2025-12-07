## Tutor Support System Frontend

Next.js (App Router) + Tailwind CSS UI for the BK Tutor Program. Mirrors the original static HTML design and calls the backend REST API where available.

### Requirements
- Use **Node.js 20** (recommended for SWC compatibility).
- npm.

### Setup & Run
```bash
cd convert_frontend
cp .env.local.example .env.local   # adjust NEXT_PUBLIC_API_BASE_URL if backend not on http://localhost:8080/api
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```
Open http://localhost:3000 to view.

### Quick Navigation (no login needed)
- Login: `/`
- Student: `/student` (dashboard), `/student/find-tutor`, `/student/tutor/:id`, `/student/schedule/upcoming`, `/student/schedule/past`, `/student/session/:id/evaluation`, `/student/resources`, `/student/resources/:id`
- Tutor: `/tutor` (dashboard), `/tutor/availability`, `/tutor/mentees`, `/tutor/resources`, `/tutor/resources/:id`
- Coordinator: `/coordinator/meeting-management` (redirects from `/coordinator`), `/coordinator/users-management`, `/coordinator/reports`

### Project Map
- `src/app/page.tsx` – login/role selection.
- `src/app/student/*` – student dashboard, tutor search/profile, schedules, evaluations, resources.
- `src/app/tutor/*` – tutor dashboard, availability, mentees, resources.
- `src/app/coordinator/*` – coordinator sidebar layout with meeting, user, and report management.
- `src/lib/api.ts` – typed API helpers against the Spring backend.
- `src/lib/auth-context.tsx` – client-side auth/session storage.

### Notes
- Scripts set `NEXT_DISABLE_LIGHTNINGCSS=1` to avoid platform-specific Lightning CSS binaries; no extra native installs are needed.
- Tailwind v4 (config-less) is used; styles live in `src/app/globals.css`.
- Font Awesome loads via CDN in `src/app/layout.tsx`.
- If `npm run lint` fails, it’s due to an upstream eslint/SWC dependency; app build/run still works.***
