# Vvook Management — Development Log

## Session 01 — 2026-08-17

### Goal

Bootstrap a production-grade Next.js project from scratch — repo, git workflow, tooling, CI — for the Vvook Management agency site. This is a deliberate fresh start: an earlier attempt exists at `rebuild_website/vvook` (real git history, working components), but the client changed the design direction, the page structure, and the approach, so we're rebuilding from zero rather than retrofitting it. The old project stays untouched as reference; nothing was copied from it.

---

### 1. Repo bootstrap

**What**: Created `github.com/miguandr/vvook-website` (public), `git init` locally, `.gitignore` for a Next.js + Sanity + Playwright stack.

**Why a new name**: the agency's original repo name (`vvook`) was already taken by the earlier attempt — kept that one untouched and picked `vvook-website` for this one.

**Why public**: this project doubles as a portfolio piece — a private repo doesn't help there.

---

### 2. Git workflow — main / dev / feature branches, PR-only

**Decision**: `main` (production) ← `dev` (integration) ← feature branches (`feat/`, `fix/`, `chore/`, `test/`). No direct commits to `main` or `dev`, ever — enforced with GitHub branch protection (`enforce_admins: true`, so not even the repo owner can bypass it), not just convention. Conventional Commits throughout.

**Why enforce it technically instead of just agreeing to it**: convention alone is easy to break by habit under time pressure. A protection rule makes the discipline non-optional.

**Mistakes made and what they taught us** (worth keeping — this is exactly the kind of thing that's obvious in hindsight and invisible beforehand):

- **`gh pr create` without an explicit `--base` silently targets the repo's *default* branch.** We hadn't set a default, so it defaulted to `main`. A duplicate PR got created (and later accidentally merged) straight into `main` instead of `dev`. **Fix**: `gh repo edit --default-branch dev` — now an omitted `--base` is safe.
- **Adding a file to `.gitignore` does not retroactively untrack it.** `CLAUDE.md` and `ROADMAP.md` (internal planning docs, not meant to be public) had already been committed before we gitignored them — they kept showing up in every commit anyway. `git rm --cached` is what actually stops tracking a file; `.gitignore` only prevents *new* untracked files from being added.
- **A trailing slash in `.gitignore` changes its meaning.** `CLAUDE.md/` (trailing slash) only matches a *directory* named `CLAUDE.md` — since it's a file, that pattern silently matched nothing. Needed `/CLAUDE.md` (leading slash to anchor to repo root, no trailing slash).
- **`git reset --hard` discards uncommitted changes without asking, even mid-command-chain.** Running it to fix a diverged branch silently wiped unrelated uncommitted edits to three files. Lesson: always check `git status` (or `git stash`) immediately before any `reset`/`checkout`/`restore` that can touch the working tree — even when the reset's *stated* goal has nothing to do with those files.
- **Once history is pushed to a public remote, removing a file in a new commit isn't enough** — it's still readable in the old commits. Fully scrubbing it requires rewriting history (an orphan branch with a single clean root commit) and force-pushing, which in turn requires temporarily *removing* branch protection (`DELETE .../protection`), pushing, then restoring the exact same protection settings (`PUT .../protection`). Low-risk here only because the repo was brand new with no other collaborators — this is not a casual operation on a mature shared repo.

---

### 3. Next.js 16 scaffold

**Command**:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**`npx` vs `npm`, in one line**: `npx` runs a package once without installing it permanently (used here to run the *generator* `create-next-app`); `npm` installs and manages the packages your app actually depends on at runtime (`next`, `react`, `tailwindcss`...) — which `create-next-app` itself sets up in `package.json` and installs via `npm` as part of what it does.

**Gotcha**: `create-next-app` refuses to scaffold into a non-empty directory beyond a small allowlist (`.git`, `.gitignore`, etc.) — it does *not* allow `README.md`, `CLAUDE.md`, or other project files we already had. Fix: moved the conflicting files to a sibling temp folder, ran the scaffold, moved them back (the generator's own boilerplate `README.md` gets overwritten by ours on the way back in, which is what we want).

**Stack confirmed by the scaffold**: Next.js 16.3.1, React 19, Tailwind CSS v4 (CSS-first — no `tailwind.config.ts`, tokens go in `@theme` inside `globals.css`), Turbopack dev server.

**`AGENTS.md`**: Next.js 16 auto-generates this file to warn AI coding assistants that this version has breaking changes vs. their training data, pointing at `node_modules/next/dist/docs/` for the real docs. It's regenerated by `next dev`, and its own embedded instructions say to keep it committed (not gitignored) — otherwise it shows as a permanent uncommitted diff.

---

### 4. Repo hygiene — what's public vs. private, and why

| File | Tracked? | Why |
|---|---|---|
| `CLAUDE.md`, `ROADMAP.md` | No (gitignored) | Internal planning docs / client context — not part of the deliverable |
| `.claude/settings.json`, `.atl/` | No (gitignored) | AI tooling config/cache, irrelevant to anyone cloning the repo |
| `AGENTS.md` | Yes | Next.js itself asks for this — see above |
| `README.md`, `.gitignore`, config files, `src/`, `public/` | Yes | The actual deliverable |

Also removed the `create-next-app` default boilerplate content: a "Deploy Now" button linking straight to `vercel.com` (we're hosting on Netlify, chosen specifically for pricing predictability — shipping a competitor's marketing CTA in our own homepage made no sense), plus three completely unused leftover SVGs (`file.svg`, `globe.svg`, `window.svg` — confirmed via `grep` that nothing in `src/` referenced them). `src/app/page.tsx` is now a neutral placeholder until the real design lands from Figma.

---

### 5. CI pipeline

**What**: GitHub Actions workflow (`.github/workflows/ci.yml`) running on every PR/push to `dev`/`main`: `npm ci` → `npm run lint` → `npm run build`. Branch protection on both `dev` and `main` now *requires* this check to pass before merge is even possible (`required_status_checks`, `strict: true` — also forces your branch to be up to date with the target before merging).

**Bug found and fixed the same day CI went live** (exactly what CI is for): the pipeline originally also ran a standalone `npm run typecheck` (`tsc --noEmit`) *before* `npm run build`. It failed with `Cannot find name 'LayoutProps'` — a Next.js 16 feature (typed layout/page props) whose type declarations live in `.next/types/`, which only gets generated by running `next build` or `next dev`. On a fresh CI checkout, that directory doesn't exist yet when a bare `tsc` runs first. Since `next build` already performs full TypeScript checking internally as part of the build (confirmed in its own output: "Running TypeScript..."), the standalone step was both broken *and* redundant — removed it from CI. The `typecheck` npm script stays in `package.json` for local/editor use, where `.next/types` typically already exists from a prior `dev`/`build` run.

---

### Pending — end of Session 01

- [x] Share the Figma file link and pull real design tokens (`get_variable_defs`, `get_screenshot`) into Tailwind's `@theme`
- [ ] Confirm real page list/structure with the client (design and page count changed from the original brief)
- [ ] Sanity project setup and schema (talent, categories, about, site settings)
- [ ] Merge `dev` → `main` once there's something real worth releasing (right now `main` is still just the bootstrap commit — that's expected, not a bug)

---

## Session 02 — 2026-08-17

### Goal

Turn the real Figma file into working design tokens (Phase 2), fix a git process mistake found along the way, and lock in how future sessions should communicate.

---

### 1. Accidental merge into `main`, and a full history rewrite

**What happened**: a duplicate PR (opened without an explicit `--base`) got merged straight into `main` instead of closed, and separately the internal docs (`CLAUDE.md`/`ROADMAP.md`) were still recoverable in `main`'s old commit history even though newer commits had already stopped tracking them.

**Fix**: `gh repo edit --default-branch dev` so an omitted `--base` can never target `main` again. Then a full history rewrite — one clean root commit with only the real deliverable files, branch protection temporarily removed on both `main`/`dev` to allow the force-push, then restored with identical settings. Both branches now share one clean commit as their shared root.

**Why this was low-risk here**: brand-new repo, no other collaborators, nothing valuable in the discarded history. This is not a technique to reach for casually on a mature shared repo.

---

### 2. Figma tokens — verify, don't estimate

**Process**: `get_metadata` + `get_screenshot` to orient across three key frames (Welcome, Landing/grid, Model detail) before touching any values, then `get_variable_defs` for real Figma Variables (only the brand yellow, `#faff00`, turned out to be a proper Variable) and `get_design_context` for everything else Figma doesn't tokenize by default — exact hex codes, real font names and weights, pulled straight from the generated implementation code rather than eyeballed off a screenshot.

**Confirmed tokens** (`src/app/globals.css`, `@theme` block):
```css
--color-vvook-yellow: #faff00;
--color-vvook-black: #080808;
--color-vvook-grey: #C3BEBE;
--color-vvook-lightgrey: #d9d9d9;
--font-logo: var(--font-bebas), sans-serif;      /* Bebas Neue — placeholder until Boris sends the real brand font */
--font-display: var(--font-anonymus), monospace;  /* Anonymous Pro — 400 + 700 */
--font-menu: var(--font-dm), monospace;           /* DM Mono — 500 */
```

**Lesson on trust**: early on, values Miguel had entered by hand were wrongly assumed to be guesses — they weren't; he'd read them directly off the Figma canvas himself. Verified against `get_design_context` afterward and every single one was exactly right. Correcting that mistake mattered more than the values themselves — check before doubting, not after.

**Deliberately NOT tokenized**: grid card size (275×375px) and gap (25px). These are real, confirmed numbers, but they're specific to one desktop frame width, not brand-level constants — colors and fonts are the same on every screen size, layout measurements usually aren't. They'll be written as responsive Tailwind classes directly on the grid component in Phase 4, once a mobile Figma frame confirms what they should be there too (mobile turned out to reuse the *same* card size, just fewer visible columns — same component, different arrangement, not different tokens).

---

### 3. `next/font` — making the font tokens actually real

**The gap**: tokens with a font *name* string don't make text render in that font — no browser has "Anonymous Pro" pre-installed. `next/font/google` downloads the font file at build time and exposes it as a CSS variable; the `@theme` tokens above were updated to point at those variables (`var(--font-bebas)`) instead of raw strings.

**Where the variables get declared**: `src/app/layout.tsx` (the root layout — wraps every page in the app), using `.variable` (defines the CSS var, styles nothing by itself) rather than `.className` (would apply the font directly to whatever element it's on — wrong here, since we don't want all of `<body>` in Bebas Neue). CSS variables cascade down the DOM automatically, no import needed — fundamentally different mechanism from JS module imports.

**Cleanup in the same file**: removed `Geist`/`Geist_Mono`, the scaffold's own default demo fonts, unused here. Same category of leftover cruft as the Vercel-branded boilerplate homepage from Session 01 — the scaffold generator leaves a lot of its own defaults behind that don't belong once real branding exists. Also removed a dead `@theme inline` block in `globals.css` still referencing the now-deleted Geist variables, and the OS-driven `prefers-color-scheme` dark-mode block — Vvook's colors are fixed per page (yellow home, black model page), not meant to auto-swap based on a visitor's OS setting.

**Weights confirmed from Figma, not guessed**: the exact weight name is embedded directly in the class strings Figma's tool returns — `font-['Anonymous_Pro:Bold']`, `font-['Anonymous_Pro:Regular']`, `font-['DM_Mono:Medium']`. Anonymous Pro needed both 400 and 700 (different weights for the model name vs. the stats line); DM Mono only 500 so far.

---

### 4. Style guide page — visual proof the tokens work

**What**: `src/app/style-guide/page.tsx` — a swatch per color, a sample line per font, nothing else. First real proof the whole token pipeline (Figma → `@theme` → `next/font` → an actual rendered page) works end to end, rather than trusting the CSS blindly.

**Why it's a separate route, not a change to the existing homepage**: in App Router, folder = URL. A new folder (`app/style-guide/`) with its own `page.tsx` is a distinct route (`/style-guide`) from `app/page.tsx` (`/`) — same filename, different path, no conflict.

---

### 5. Design/animation choreography — documented in full, not built yet

Extensive walkthrough of the real Figma frames (Welcome, Landing/grid desktop + mobile, Model detail) produced a full choreography spec for the site's signature transitions — logo fade-in, the grid's entry animation (settled on a single zoom-in + a small "nudge" as the drag affordance, after an earlier more elaborate zoom-out-then-zoom-in idea was deliberately scoped back down), and the model-detail transition (shared-element photo expansion + sibling photos accelerating toward a convergence point + yellow-to-black crossfade + 3D photo fan reveal). None of this is built — it's Phase 5 work, intentionally sequenced after static pages exist. Full spec lives in Engram (`vvook/design-spec`), not duplicated here since it'll keep evolving before it's actually implemented.

Also surfaced: Boris wants control over which models appear in the grid and in what order, most important first. Likely a singleton Sanity document holding an ordered array of talent references — Studio's native drag-to-reorder on reference arrays handles the ordering UI for free. Real schema design happens in Phase 3.

---

### 6. Working agreement: shorter explanations

Miguel has ADHD — long paragraphs of explanation are hard to follow. Added an explicit "Estilo de comunicación" section to `CLAUDE.md`: short, compact answers, bullets or a brief code example over prose, big concepts broken into small chunks with check-ins rather than one long message. Applies to every response from here on, not just teaching moments.

---

### Pending — Next Session

- [ ] Confirm real page list/structure with the client (design and page count changed from the original brief)
- [ ] Sanity project setup and schema (talent, categories, about, site settings, featured-grid ordering)
- [ ] Merge `dev` → `main` once there's something real worth releasing
- [ ] Revisit `body`'s remaining default background/foreground vars in `globals.css` once real pages set their own
