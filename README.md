# vvook

Website for a modeling agency — Next.js, Sanity, GSAP, Netlify. Built end-to-end (design import through deploy) as a full production reference project.

**Status:** early scaffolding.

## Stack

Next.js 16 (App Router) · Tailwind CSS v4 · Sanity · GSAP · Netlify · Resend · Vitest + Playwright

## Getting started

> Setup instructions land in Phase 1 once the app is scaffolded (`create-next-app`) — this section is a placeholder so the shape of the doc is right from commit #1.

```bash
# TODO (Phase 1): install, env vars, dev server
```

## Project structure

Filled in once the folder layout exists on disk (Phase 1).

## Testing

Unit tests (Vitest + React Testing Library) live next to the code they cover. E2E tests (Playwright) live in `/e2e`. Both run in CI on every PR — see `.github/workflows/ci.yml`.

```bash
# TODO (Phase 1): npm test / npm run test:e2e
```

## Contributing

- Conventional commits, enforced by commitlint on `commit-msg`.
- Every PR needs CI green (lint, typecheck, unit, E2E, build) before merge.
- `main` and `dev` are protected — all work happens on a feature branch, merged via PR.

## License

TBD.
