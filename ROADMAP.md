# Project Roadmap

A production website for a modeling agency (real client), built end-to-end — design import, CMS, frontend, backend, testing, and CI/CD — as a portfolio-grade reference project.

> Agency branding and project name are still pending the Figma handoff (Phase 2). This roadmap will be renamed once that's confirmed.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR/SSG, current stable, Cache Components caching model |
| Styling | Tailwind CSS v4 | CSS-first design tokens (`@theme`), no separate config file |
| CMS | Sanity (Studio embedded at `/studio`) | Client edits talent profiles, photos, about copy without a deploy |
| Animation | GSAP + `@gsap/react` | Choreographed page transitions |
| Hosting | Netlify (OpenNext adapter) | Predictable pricing, auto PR previews |
| Email | Resend (custom Route Handler) | Real backend code path, not a form SaaS |
| Testing | Vitest + React Testing Library, Playwright | Unit + E2E, written alongside each feature |

## Repo & workflow conventions

- Conventional commits, enforced by Husky + commitlint.
- Every PR must pass CI (lint, typecheck, unit tests, E2E, build) before merge to `main`.
- Netlify deploy previews on every PR; production deploys on merge to `main`.
- One phase below ≈ one or a few PRs. Each phase ships its own tests — testing is not a separate later phase.

## Phases

### Foundation

- [ ] **0 — Repo bootstrap.** GitHub repo, remove stale scaffold, Husky/commitlint/CI skeleton running before any app code exists. *Verifies: CI green on a trivial commit.*
- [ ] **1 — Next.js init & deploy plumbing.** `create-next-app` (TS, Tailwind v4), Vitest/RTL and Playwright wired with trivial passing tests, Netlify preview + prod working. *Verifies: 1 unit + 1 E2E test, both in CI.*
- [ ] **2 — Design tokens from Figma.** Pull real tokens via Figma MCP (`get_variable_defs`, `get_screenshot`) into Tailwind's `@theme`, wire `next/font`, build a style-guide page for visual QA.
- [ ] **3 — Sanity schema & embedded Studio.** Real project/dataset, all content schemas, `/studio` embed, TypeGen, CORS, confirm Tailwind preflight doesn't break Studio UI.

### Build

- [ ] **4 — Static layout & pages.** Header/Footer, `(site)` vs `studio` layout split, Home/About/Legal skeletons — no dynamic data or animation yet.
- [ ] **5 — GSAP page transitions.** `TransitionProvider` / `TransitionLink` / `template.tsx`, reduced-motion handling, focus management on route change.
- [ ] **6 — Talent listing & detail (dynamic).** Category routes, `generateStaticParams`, JSON-LD (`Person`), image pipeline, webhook-driven revalidation.
- [ ] **7 — Contact form (Resend).** Route Handler, Zod validation, spam mitigation (honeypot).
- [ ] **8 — SEO pass.** Sitemap/robots, OG/Twitter audit, structured-data validation, `noindex` on previews. Analytics decision resolved here (see below).

### Quality & launch

- [ ] **9 — Accessibility pass.** `axe-core` in CI, keyboard audit of the transition system, manual screen-reader smoke test.
- [ ] **10 — CI/CD hardening.** Branch protection, real domain + DNS + Resend DKIM/SPF, full env-var audit.
- [ ] **11 — Real content.** Client's actual photos/bios via Studio, E2E re-run against real data shapes.
- [ ] **12 — Launch checklist.** Final Lighthouse pass, Search Console/sitemap submission, client Studio training, monitoring.

## Key architecture decisions

| Topic | Decision | Why |
|---|---|---|
| Repo layout | Single Next.js app at root, Studio embedded at `/studio` | One deploy, less friction than a split repo |
| Category taxonomy | Real `category` documents, not a hardcoded enum | Client can add/rename categories without an engineering ticket |
| Talent status | Soft `status` field (active/onLeave/archived) | Never hard-delete a talent record; preserves references |
| Contact submissions | Resend only, not stored in Sanity | Avoids unmanaged PII sitting in a general-purpose CMS |
| Legal pages | Hardcoded `.tsx`, not Sanity documents | Legal copy shouldn't be editable by any content editor without review |
| Category routes | Real `/talent/[category]` routes, not query params | Independently indexable for SEO; also gives GSAP transitions something to animate between |
| Contact form | Route Handler, not a Server Action | Deliberately visible backend code for the portfolio |
| E2E target in CI | Local `next build && next start`, not the Netlify preview URL | Faster, self-contained gate; preview stays for manual visual QA |

## Open decisions

- [ ] **Analytics** — GA4 (needs a cookie-consent banner) vs. Plausible/Fathom (privacy-first, no banner) vs. none for now. Resolve before Phase 8.
- [ ] **Talent taxonomy** — categories below assume fashion/commercial/fitness/runway; confirm the agency's real board structure before finalizing the Sanity schema in Phase 3.

## Next step

See [README.md](./README.md) for local setup once Phase 1 lands.
