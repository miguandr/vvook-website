# vvook

Website for a modeling agency — Next.js, Sanity, GSAP, Netlify. Built end-to-end (design import through deploy) as a full production reference project.

**Status:** early scaffolding — see [ROADMAP.md](./ROADMAP.md) for the current phase and what's next.

## Stack

Next.js 16 (App Router) · Tailwind CSS v4 · Sanity · GSAP · Netlify · Resend · Vitest + Playwright

Full rationale for each choice is in [ROADMAP.md](./ROADMAP.md#stack).

## Getting started

> Setup instructions land in Phase 1 once the app is scaffolded (`create-next-app`) — this section is a placeholder so the shape of the doc is right from commit #1.

```bash
# TODO (Phase 1): install, env vars, dev server
```

## Project structure

See [ROADMAP.md](./ROADMAP.md) for the target folder layout and architecture decisions; it gets filled in here once it exists on disk.

## Testing

Unit tests (Vitest + React Testing Library) live next to the code they cover. E2E tests (Playwright) live in `/e2e`. Both run in CI on every PR — see `.github/workflows/ci.yml`.

```bash
# TODO (Phase 1): npm test / npm run test:e2e
```

## Contributing

- Conventional commits, enforced by commitlint on `commit-msg`.
- Every PR needs CI green (lint, typecheck, unit, E2E, build) before merge.
- See [ROADMAP.md](./ROADMAP.md) for phase-by-phase scope.

## License

TBD.
