# ENCORE — live music discovery

ENCORE is a mobile-first discovery marketplace for live music across Malaysia and Singapore. The current experience uses the **After Dark** design system: near-black foundations, editorial typography, warm venue photography and soft violet interaction accents.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The customer journey begins on the real homepage at `/`.

## Product routes

- `/` — discovery-led customer homepage
- `/discover` — filterable performances, venues and artists with list/map controls
- `/venues`, `/venues/[slug]` — venue directory and profiles
- `/artists`, `/artists/[slug]` — artist directory and profiles
- `/gigs/[slug]` — performance details
- `/artist/register`, `/venue/register` — onboarding previews
- `/artist/dashboard`, `/venue/dashboard` — role-specific sample workspaces
- `/for-business` — venue-owner proposition
- `/account`, `/saved` — honest empty states until auth and persistence are connected
- `/legacy` — preserved original implementation

## Data and integrations

The repository has no database or authentication provider. Listings in `src/data/demo.ts` are fictional sample data and are visibly labelled. Dashboard analytics deliberately show unavailable states rather than fabricated numbers. Form workflows use local React state and do not submit external messages or payments.

Copy `.env.example` to `.env.local` only if you need the legacy Google Places integration:

- `GOOGLE_MAPS_SERVER_API_KEY` — server route handlers
- `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` — browser map, restricted by HTTP referrer
- `NEXT_PUBLIC_SITE_URL` — canonical site origin

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment safety

The Vercel project is connected to the repository default branch. Feature branches should be reviewed through preview deployments before merge. Do not connect production customer data or enable payments until authentication, authorization, persistence and audit logging exist.
