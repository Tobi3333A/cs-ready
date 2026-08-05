# CS-Ready

Know if you're actually ready for that internship — or new-grad role. CS-Ready is an AI coach for CS students: connect the same signals recruiters look at, get an honest readiness score, and work a plan built for your gaps.

## How it works

1. **Create your profile** — Target roles, school, and where you are today
2. **Connect your signals** — GitHub, LeetCode, LinkedIn, portfolio, resume, transcript
3. **Get your readiness score** — Strengths and gaps across the categories that matter, plus role fit
4. **Follow your roadmap** — Ranked actions tailored to your targets; keep going with the AI coach

## Features

- **Integrations** — Link GitHub, LeetCode, LinkedIn, and portfolio; upload resume and transcript
- **Readiness breakdown** — Scores for DSA, Projects, GitHub, System Design, Resume, and Behavioral, with role-fit guidance
- **Personalized roadmap** — Week-by-week steps and tasks aimed at closing your real gaps
- **AI coach** — Multi-conversation chat grounded in your profile and progress

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- [Supabase](https://supabase.com) (Auth, database, storage)
- [Vercel AI SDK](https://sdk.vercel.ai) via AI Gateway
- [Parallel](https://parallel.ai) web tools for readiness research

## Getting started

### Prerequisites

- Node.js
- [pnpm](https://pnpm.io)
- A [Supabase](https://supabase.com) project
- A [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) API key
- A [Parallel](https://platform.parallel.ai/settings?tab=api-keys) API key

### Setup

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local` (see [`.env.example`](.env.example)):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway (used by the AI SDK for model calls) |
| `PARALLEL_API_KEY` | Parallel web search/extract for readiness analysis |

### Supabase schema

This repo includes generated types in [`supabase/types.ts`](supabase/types.ts) and local Supabase config, but **no SQL migrations**. Provision Auth and a schema that matches those types yourself, including:

- Tables: `profiles`, `integrations`, `readiness_breakdown`, `roadmap`, `roadmap_steps`, `roadmap_tasks`, `coach_conversations`, `coach_messages`
- Storage buckets: `resumes`, `transcripts`

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/            # App Router: marketing, auth, dashboard; AI routes under app/api/ai/
components/     # UI, marketing, and dashboard components
lib/            # Supabase clients, constants, integrations, coach helpers
supabase/       # Local Supabase config and generated DB types
```

## License

Open source under the [MIT License](LICENSE).
