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

### Pending — end of Session 02

- [ ] Confirm real page list/structure with the client (design and page count changed from the original brief)
- [x] Sanity project setup and schema (talent — categories/gender explicitly dropped, see Session 03)
- [ ] Merge `dev` → `main` once there's something real worth releasing
- [ ] Revisit `body`'s remaining default background/foreground vars in `globals.css` once real pages set their own

---

## Session 03 — 2026-08-17

### Goal

Set up Sanity: a real project, the Studio, and the first content schema (`talent`).

---

### 1. Standalone Studio, not embedded — a plan reversal mid-setup

**What changed**: ROADMAP originally called for Studio embedded in the Next.js app at `/studio` (decided back in the initial architecture pass). Loading Sanity's own current best-practices guide mid-setup showed that's now explicitly *not recommended* for new projects — standalone is.

**Why standalone wins**: `sanity dev`/`sanity build` run on Vite — 10-30x faster than compiling the Studio through Next.js. Standalone Studios auto-update with bugfixes/features; embedded ones need a manual dependency bump + redeploy every time (Next.js doesn't support the ESM import maps needed for auto-update). TypeGen watches and regenerates types live under `sanity dev`; embedded requires re-running it by hand after every query change.

**Why the switch cost nothing**: caught before any embedded Studio existed to migrate away from — pure upside, no rework. Result: `studio/` is its own app at the repo root, own `package.json`/`node_modules`/git-ignore, runs on `localhost:3333` alongside `next dev` on `localhost:3000` — two dev servers, not one embedded route.

**Mechanical hiccups** (same root cause twice): both `npm create sanity@latest -- --output-path studio` and an earlier `npm install` were run from `src/app/` instead of the repo root. `npm install` self-corrected (npm walks up to find the nearest `package.json`); `--output-path` did not (it's relative to cwd), landing the whole Studio inside `src/app/studio/` until caught and moved with `mv src/app/studio studio`. Lesson: `npm install` is forgiving about cwd, most CLI scaffolding flags are not — check `pwd` before any command that writes new files/folders.

---

### 2. Sanity project ownership — pending transfer

**What**: no client (Boris) response when a real Sanity account was needed to create the project, so it was created under Miguel's personal Sanity account to keep moving, with `--dataset production` (default single dataset — no need for multiple environments yet).

**Why this is explicitly temporary**: a client's CMS project living permanently under the freelancer's personal account is a real, common professional pitfall — if the working relationship ends, the client loses access to their own backend. Sanity supports transferring project ownership to another organization later, so this is a reversible stopgap, not a compromise on the end state. Tracked as an open item in `ROADMAP.md` until Boris creates his own account/org and it gets transferred.

---

### 3. The `talent` schema — three real corrections along the way

**Mechanics recap**: `defineType`/`defineField` in `studio/schemaTypes/talent.ts`, aggregated into `studio/schemaTypes/index.ts`'s `schemaTypes` array. `defineType({...})` on its own does nothing without `export default` in front of it — easy to forget, breaks the import silently (well, loudly — nothing shows up in Studio).

**Bugs caught and fixed**:
- `gallery: { type: 'image' }` only allows one photo — needed `type: 'array', of: [{ type: 'image' }]` for the multi-photo fan we saw in Figma.
- `category: { type: 'document' }` isn't a real field type. The right type for "this field points at another document" is `reference`, with `to: [{ type: '...' }]` naming which document type it can point to.

**A real, deliberate scope decision — no gender/category field**: early drafting drifted toward reviving old-project baggage (Women/Men/Commercial from `rebuild_website/vvook`, explicitly ruled out weeks ago) and then toward using presence/absence of unrelated fields as an implicit category signal — both corrected. Final call, stated directly by Miguel: **no categorization by gender on `talent` at all.** Simple, and avoids modeling a distinction nobody asked for.

**`suit`/`dress` — not what they looked like at first.** Read initially as a disguised gender field (fill one or the other → implicit category). Actually just optional wardrobe sizing for booking — a suit size for menswear shoots, a dress size for womenswear shoots, independent of each other, same spirit as the `shoes` size field already in the schema. Kept as `number` per Miguel's call (his read on the agency's actual sizing convention), despite the general risk that clothing sizes sometimes include letters (`'42R'`) that wouldn't fit a number field — worth revisiting only if that ever actually comes up.

**Validation clarified**: fields are optional by default in Sanity — nothing has to be done to make a field optional. `validation: (Rule) => Rule.required()` is something you *add* to force a field to be filled in; used on `name` and `mainPhoto` only.

**Final v1 shape**: `name` (string, required), `mainPhoto` (image, required), `gallery` (image array, optional), `height`/`chest`/`waist`/`hips`/`shoes`/`suit`/`dress` (numbers, all optional). Verified visually in Studio at `localhost:3333` before committing.

---

### 4. Tests — deliberately none this session

Nothing meaningful to unit test yet — a schema is declarative configuration, not logic. Real test coverage starts next session once GROQ queries and data-fetching functions exist (extracted into plain async functions per the original architecture plan, testable with a mocked Sanity client). Added explicitly to `ROADMAP.md` Phase 3b rather than skipped silently.

---

### Pending — end of Session 03

- [x] Connect Next.js to Sanity: client setup, GROQ queries, TypeGen, CORS origins for `localhost:3000`
- [x] First real unit tests — data-fetching functions with a mocked Sanity client
- [ ] Confirm real page list/structure with the client
- [ ] Transfer Sanity project ownership to Boris once he's responsive
- [ ] Merge `dev` → `main` once there's something real worth releasing

---

## Session 04 — 2026-08-18

### Goal

Finish Phase 3b: real GROQ queries, TypeGen actually working end to end, environment variables, the first unit test, and CI running it. Close out Phase 3 entirely.

---

### 1. `queries.ts` needs `defineQuery`, not a plain string

The first draft of `TALENTS_QUERY` (later renamed `TALENT_GRID_QUERY` — see §4) was a plain template literal. TypeGen only detects queries wrapped in `defineQuery()` (or the `groq` tag) — a bare string is invisible to it, silently skipped, no error. Fixed by wrapping the query. Full mechanics — including the "two separate inputs, not a chain" model (schema → `schema.json`, queries scanned independently, both combined into `sanity.types.ts`) — written up properly in the new `docs/SANITY.md`, not duplicated here.

---

### 2. TypeGen config placement bug, then a real "does this even work" gap

`typegen: {...}` first landed as a bare top-level statement in `sanity.cli.ts`, outside `defineCliConfig({...})` entirely — invalid syntax, caught immediately. Once moved inside correctly and `schema.json` extracted for the first time (`npx sanity schema extract`), `sanity dev`'s watch mode started regenerating types automatically — the standalone-Studio advantage from Session 03, now actually observed working, not just theoretical.

Even with `sanity.types.ts` generating real types, `client.fetch(TALENT_GRID_QUERY)` still returned `any` — missing `overloadClientMethods: true` in the typegen config, which is what makes `client.fetch()` automatically pick up the right result type for a given `defineQuery`. Added it, regenerated, confirmed via hover in the editor (`const talents: TALENT_GRID_QUERY_RESULT`) and, more convincingly, by intentionally typo-ing a field name and watching TypeScript flag it immediately.

---

### 3. Environment variables

`projectId`/`dataset` moved out of `client.ts` and into `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`, set in `.env.local` (real values, gitignored) and mirrored empty in `.env.example` (committed, documents what's needed). `NEXT_PUBLIC_` prefix specifically because these may need to be read client-side later (Visual Editing); without it Next.js keeps a var server-only.

**Real mistake worth remembering**: first attempt wrote `projectId: 'NEXT_PUBLIC_SANITY_PROJECT_ID'` — the variable's *name* as a literal string, not its *value*. `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID` reads the value; without `process.env`, it's just text.

**Second-order bug this caused**: these are `NEXT_PUBLIC_` (not secret) values, but CI has no `.env.local` at all — `.env.local` is gitignored on purpose and never reaches the runner. `next build` failed in CI with `Configuration must contain projectId`, because `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID` was simply `undefined` there. Fixed by setting them directly as plain (non-secret) `env:` values at the job level in `ci.yml` — genuinely public values don't need GitHub Secrets, just don't hardcode anything that actually is sensitive (a write token, an API key) the same way; those go through Secrets.

---

### 4. Schema stayed put; the query got renamed

Talked through renaming `talent` (the schema) to `talent_grid` to match the query's purpose — rejected. The schema describes what the *data is* (a talent/person), and the exact same `talent` document will power both the grid (partial fields) and, later, the detail page (every field). Renaming a schema after a single use case would tie it to that one page. The **query** got the more specific name instead: `TALENTS_QUERY` → `TALENT_GRID_QUERY`, since a future `TALENT_DETAIL_QUERY` (or similar) will exist alongside it, and vague names would collide semantically even if not literally.

---

### 5. Extracted `getTalents()`, wrote the first test

`client.fetch(TALENT_GRID_QUERY)` moved out of `page.tsx` into its own function, `src/sanity/lib/getTalents.ts` — planned all the way back in the original architecture pass specifically so it could be unit tested without needing to render an async Server Component (a real Vitest limitation, not a workaround).

Installed Vitest for the first time this project (`npm install -D vitest`, `"test": "vitest run"` in `package.json`). First test (`getTalents.test.ts`) mocks the `./client` module with `vi.mock`, so `getTalents()` calls a fake `client.fetch` instead of hitting Sanity for real — fast, deterministic, no network dependency. Mock data was corrected to use a realistic `mainPhoto` shape (matching what a real Sanity image reference actually looks like) rather than `null`, after a good catch: `Rule.required()` makes a field mandatory in *Studio* (content authoring), not a hard type/runtime guarantee — worth remembering as a distinct thing from "this can never be null."

---

### 6. Tests now run in CI, which broke branch protection in a subtle way

Added `npm run test` as a step in `ci.yml`, between lint and build (fail on the cheapest signal first), and renamed the job from "Lint & build (includes typecheck)" to "Lint, test & build" to reflect what it now does.

**The gotcha**: branch protection requires a status check *by exact name*. Renaming the CI job orphaned the old required check — nothing ever reports a check called "Lint & build (includes typecheck)" again, so GitHub shows it permanently "pending," blocking merge indefinitely. Fixed by updating `required_status_checks` on both `dev` and `main` to require "Lint, test & build" instead. **Lesson: renaming a CI job name requires updating branch protection in the same PR, not as an afterthought.**

---

### 7. Phase 3 complete

Both 3a (Sanity project + standalone Studio + schema) and 3b (Next.js connection, TypeGen, env vars, first test, CI) are done. Full reference write-up lives in `docs/SANITY.md` (created this session) — headless CMS concept, standalone vs. embedded reasoning, the complete schema with rationale, the full data-flow diagram, every gotcha hit, and what's still open. `ROADMAP.md` updated to reflect both sub-phases done, plus a new "Pending chores" section (low-priority, no-rush items — first entry: add Prettier).

---

### Pending — Next Session (Phase 4 — Static layout & pages)

- [ ] Header/Footer shared layout
- [ ] Static skeletons: Welcome (no animation yet — just the visual shell), Home, About, Legal (privacy/image-rights — hardcoded `.tsx`, not Sanity, per the original architecture decision)
- [ ] Explicitly NOT this phase: Talent listing/detail (needs real dynamic Sanity data — Phase 6), Contact (needs the Resend backend — Phase 7), any GSAP animation (Phase 5)
- [ ] Confirm real page list/structure with the client
- [ ] Transfer Sanity project ownership to Boris once he's responsive
- [ ] Prettier (low-priority chore)
- [ ] Merge `dev` → `main` once there's something real worth releasing

---

## Session 05 — 2026-09-08

### Goal

Continue Phase 4: resolve a Header logo sizing conflict, review the FINAL About/Contact Figma designs (superseding earlier drafts), and build the About page's static structure and styling from scratch.

---

### 1. Boris set up his own Sanity project

Boris finally created his own Sanity account and invited Miguel to a brand-new project — a different `projectId` than the one used since Session 03 (`w0ka7cdd` → `sysdxpdd`), not a transfer of the old one, a fresh empty project. Decided to switch immediately rather than defer, since almost nothing existed in the old project yet. Updated everywhere the ID was hardcoded: `studio/sanity.cli.ts`, `studio/sanity.config.ts`, and `.github/workflows/ci.yml`'s job-level `env:` block. Also added an `instagram` field (type `url`) to the `talent` schema.

**Still blocked (not urgent):** Miguel's role on Boris's project is below Administrator, which blocks setting up CORS origins. Doesn't block Phase 4 — no Sanity calls happen in these static pages.

---

### 2. Header logo size — a real Figma inconsistency, resolved by keeping what's built

The About page's Figma frame showed the logo at 54px/14px, but the Header already built (Session 04, from the Landing/Model frames) uses 64px/18px. Rather than chase the Figma number blindly, the two were compared directly and the discrepancy flagged as a design inconsistency, not a build mistake. **Decision: keep 64px/18px** — the size already shipped in `Logo.tsx`.

**Open item to verify next session:** `Logo.tsx` currently reads `text-[54px]` / `text-[14px]`, not `text-[64px]` / `text-[18px]`. This contradicts the decision above — needs a check against the live Header before trusting either number further.

---

### 3. About and Contact — real final Figma designs

Miguel shared the actual final frames (node `278:273` for About, `278:229` for Contact in file `bJUzL4TpiEpnMOawTCmxn1`), superseding every earlier draft. Extracted via Figma's screenshot + metadata tools (not `get_design_context`, since Miguel writes the code himself — that tool is for generating implementation code directly, which isn't the point of this project).

**What the designs contain:**
- About: "ABOUT" kicker + "OUR VISION" headline, 4 numbered manifesto paragraphs (`|00`–`|03`), a founder block (Boris's photo + "FOUNDER" / "Boris Kralj" / "Est. 2024")
- Contact: "BOOKING & SUBMISSION" kicker + "CONNECT WITH US" headline, a booking form (Name/Organization, Email, Inquiry), Email/Tel/Instagram + Address blocks, full-bleed photo

**Discoveries:**
- **Nav active-state pattern, confirmed visually**: whichever page is current shows its nav link yellow + underlined; the other stays plain white, no underline. Not implemented yet — `NavLink` in `Header.tsx` needs `usePathname()`. Flagged as a Phase 4 follow-up.
- **Font question resolved — no new fonts needed.** Two fonts (Cormorant Garamond, Familjen Grotesk) were flagged as required based on an earlier, now-superseded About draft. Miguel corrected this directly: the FOUNDER heading is Bebas Neue (already loaded, `font-logo`) and "Boris Kralj" is Anonymous Pro (already loaded, `font-display`) — both fonts already wired since Session 02. Cormorant Garamond and Familjen Grotesk are fully dropped. **Lesson: don't infer a font family from how a screenshot looks — a condensed serif-looking render turned out to just be Anonymous Pro at a particular size. Ask the source of truth (Figma's own text-layer panel) instead of guessing from a render.**
- The email typo spotted in earlier sessions (`info@vvookmanagenet.com`) persists in the final design too. Miguel's call: not worth fixing now, he'll correct it when the Contact form is actually coded.
- Only one real Figma Variable exists on either frame: `Vvook_yellow = #faff00`, already matching the existing `--color-vvook-yellow` token — no new color token needed.

---

### 4. Building the About page — semantic HTML before Tailwind

Per the project's teaching approach, `src/app/about/page.tsx` was built in two clearly separated passes: plain semantic HTML first, styling second.

**Semantic HTML concepts covered:**
- `async` is only needed on a Server Component when it `await`s something inside (like Home's `client.fetch`). About has no data fetching yet, so no `async`.
- `<section>` groups a thematically distinct, headed block of content — it appears in the document outline, which is what search engines and screen readers use to understand page structure. Plain `<div>` carries no such meaning.
- Only **one `<h1>` per page** — it's the page's single main title. A second content block (Founder) gets `<h2>`, not another `<h1>`.
- The four numbered paragraphs are **not** an `<ol>` — the numbers are a decorative visual anchor, not a real ordered list (it's continuous prose, not discrete list items). Plain `<p>` tags, with the number as a `<span aria-hidden="true">` so screen readers skip it.
- `<hgroup>` is the correct tag for the "ABOUT" kicker + "OUR VISION" heading pair — built specifically to group a heading with associated non-heading text (like a tagline) without the tagline counting as its own outline entry.
- `next/image`'s `Image` component needs a valid `src` or it errors — since Boris's photos aren't in hand yet (requested, pending), the image tag was left commented out rather than using an invalid placeholder.

**Layout/Tailwind concepts covered:**
- Tailwind v4's spacing scale is a plain multiplier of the 4px base — real Figma offsets (52px, 64px) map directly to class names (`px-13`, `pt-16`) without needing arbitrary `[Npx]` brackets, same pattern established for the Header in Session 04.
- `flex` only arranges **direct children** — grouping the paragraph-03 + Founder text into a wrapping `<div>` was necessary so the outer `<section>` sees exactly two children (text block, photo) instead of five separate ones.
- `w-fit mx-auto` on the `<hgroup>` shrinks the container to its widest line ("Our Vision") and centers that block — since text inside stays left-aligned by default, "ABOUT" naturally lands flush with the left edge of "Our Vision" with no absolute positioning needed.
- A visible left-alignment gap remained even after that fix — not a CSS bug. Bebas Neue (like most display fonts) has inherent glyph side-bearing, most visible on the "O". Same category of issue as the Logo's "Management" vertical gap in Session 04: not a computable value, tuned by eye with a small negative margin.
- Tailwind's named text-size scale tops out at `text-9xl` (128px) — "Our Vision" needed bigger, so Miguel used an arbitrary value (`text-[12rem]`) directly rather than extending `@theme`, since it's a one-off decision he's free to revisit if Contact's headline needs the identical value later.
- **Background color placement**: `bg-vvook-black text-white` was added to `<body>` in `layout.tsx` (global), not scoped to just `<main>` — because `Header` has no background of its own and would otherwise show through as white on top of a black page. This works today because only About and Contact exist, and both want black. **Known future conflict, not solved yet**: Home is planned with a yellow background, which will clash with this global black. Two candidate fixes already discussed: Next.js route groups (each with its own layout/background), or the previously-noted idea of a transparent, `mix-blend-mode`-driven Header that floats over Home's photo grid. Deliberately deferred — solving it now would be designing for a page that doesn't exist in code yet.

---

### 5. Commits this session

Four separate commits, split by work unit rather than lumped together (Sanity config vs. schema vs. components vs. page content are different concerns):
- `chore: switch Sanity project to Boris's account`
- `feat: add instagram field to talent schema`
- `feat: add Header/Logo components and wire into root layout`
- `feat: build About page structure and content`

**Left uncommitted on purpose:**
- `src/app/contact/page.tsx` — created but completely empty (0 bytes, no default export). Committing it as-is would break `next build`, since Next.js requires every `page.tsx` to have a default export. Needs at least a placeholder component before it's safe to commit.
- `Makefile` (empty, a leftover scaffold file the original Phase 0 plan called out for deletion — never actually deleted) and `about us.docx` (a content reference document, not source code) — both intentionally left untracked, not added to git.

---

### Pending — Next Session

- [ ] Verify Logo.tsx's actual size (54/14 vs. the decided 64/18) against the live Header
- [ ] Finish About's Founder block typography (font/color classes not applied yet to `<h2>`, "Boris Kralj", "Est. 2024")
- [ ] Add Boris's real photo once received, uncomment and wire up the `Image` component
- [ ] Give `contact/page.tsx` at least a placeholder default export before the next commit
- [ ] Build Contact page structure (booking form, contact block, address, photo)
- [ ] Implement nav active-state (yellow + underline on current page) in `NavLink`
- [ ] Mobile header variant (hamburger + centered logo) — breakpoint still unconfirmed, no tablet Figma frame exists
- [ ] Confirm real page list/structure with the client
- [ ] Transfer Sanity project ownership to Boris once he's responsive (still blocked on Administrator role)
- [ ] Prettier (low-priority chore)
- [ ] Merge `dev` → `main` once there's something real worth releasing

---

## Session 06 — 2026-11-02

### Goal

Pick up after several weeks away. About/Contact designs are being fully reworked by Miguel and are explicitly not final — pivoted to Phase 6 territory instead: build the Home page's model grid against the final Grid/Model-detail Figma frames, using the real Sanity data pipeline from Session 03b with placeholder photos, since Boris hadn't sent real ones yet (he has now, for the About page specifically).

---

### 1. A full design-system reset — nothing from before carries over

Miguel redesigned every page's visual language, including the Header/Footer, since the last session. Explicit instruction for this and future sessions: never compare a new design to an old one, never assume an old decision still holds — treat each shared Figma frame as the current source of truth. Two concrete resets this session:

- **Header + Footer are now the same across every page of the site** (previously Header differed between About/Contact and the model grid — that was based on a draft that no longer exists). Header: `models` / `insta` / logo / `about` / `contact`, all in one row, same on mobile and desktop just smaller. Footer: a scrolling credit line, email/phone block, legal links (Impressum/Privacy/Terms — a real German legal requirement for commercial sites, not yet built).
- **Typography reset**: Anonymous Pro and DM Mono are both replaced by a single font, Inconsolata, used everywhere (nav, body, model names). Playfair Display is loaded for a not-yet-built use. Bebas Neue and the `font-logo` token are gone entirely — the wordmark is no longer rendered as styled text at all (see §2).

**Lesson reinforced**: don't infer a font family from how a screenshot renders — ask Miguel to check Figma's own text-layer panel. Guessed wrong twice this project (Cormorant Garamond earlier, nothing new this session, but the instinct to verify against the source instead of eyeballing a render held up).

---

### 2. The logo is now a real asset, not styled text

Boris's actual logo files arrived (`VVOOK LOGO/REGULAR` and `/SUBTITLE`, in both SVG and PNG, black and white variants). The wordmark used to be `<p>VVOOK</p>` styled with Bebas Neue — now it's the real SVG, inlined directly as JSX in `Logo.tsx` (not via `next/image`, which treats SVGs as opaque images and can't have their internal color overridden).

**The `currentColor` technique**: the raw SVG had a hardcoded hex fill (`fill: #020302`) in an embedded `<style>` block. Replaced with `fill="currentColor"` directly on each `<path>`, and deleted the `<style>`/`class` wrapper. `currentColor` makes the SVG inherit whatever CSS `color` is active on it — so `Logo` now takes a `color` prop (a Tailwind `text-*` class string) instead of hardcoding one, letting the same file render in any brand color depending on what page/background it sits on.

**Gotcha hit while editing the raw SVG by hand**: a leftover `class=` with no value (`<path class= fill="currentColor" ...>`) is invalid syntax — easy to leave behind when stripping an old `class` attribute.

---

### 3. Header becomes the project's first Client Component

Needed two things that are both "what page/route am I on" problems: the nav/logo color flips between black (Home, yellow background) and white/yellow (every other page, black background), and later a page-active indicator. Both need `usePathname()`, which only works with `"use client"` — Header is the first component in this project that isn't a plain Server Component.

**Two real bugs found via this change, both good debugging lessons:**
- `$(color)` instead of `${color}` in a template literal — parentheses aren't template-literal interpolation syntax, so the literal text `${color}` (or `$(color)`) renders straight into the `class` attribute instead of a real Tailwind class. Caught by inspecting the actual rendered HTML in DevTools, not by re-reading the source — **when code looks right but the browser disagrees, check the real DOM output, don't keep re-reading the file.**
- After the fix was actually correct in source, the browser still showed the bug — stale Next.js dev cache. `rm -rf .next` and restarting resolved it. Second instance this project of "source is right, browser is wrong, it's the cache" — worth remembering as a standard first move when behavior doesn't match code.

**`position: fixed` on Header** — makes it float over page content instead of pushing it down (needed for the "see the grid scroll behind the header" effect, and for color to be decided by what's visually behind it later in Phase 5). Side effect that wasn't obvious upfront: a `fixed` element no longer reserves space in normal flow, so page content needs its own top padding to avoid rendering underneath it.

---

### 4. A real CSS cascade bug: unlayered CSS always beats Tailwind utilities

`globals.css` had scaffold leftovers from `create-next-app`:
```css
:root { --background: #F1F1F1; --foreground: #171717; }
body { background: var(--background); color: var(--foreground); }
```
This plain CSS rule — written outside any `@layer` — was silently overriding `bg-vvook-black` on `<body>` in `layout.tsx`, even though a class selector should normally beat an element selector. The reason: Tailwind wraps its utilities in `@layer utilities`, and **CSS cascade layers are resolved before specificity** — unlayered CSS always wins over layered CSS, full stop, regardless of how specific the layered selector is. Deleted the dead scaffold block entirely; `bg-vvook-black text-white` on `<body>` now actually works as the sitewide default. This is a real, non-obvious Tailwind v4 gotcha worth remembering any time hand-written CSS coexists with Tailwind output.

---

### 5. Sanity: ordering, images, and a stale schema.json trap

**Image URL builder.** `mainPhoto` only exposes an internal asset reference, not a usable URL. Added `@sanity/image-url`, wrapped in `src/sanity/lib/image.ts` (`urlFor(source).width(400).height(530).url()`). Forcing both width AND height matters — without an explicit height, Sanity preserves each photo's original aspect ratio, so a grid of photos with different original crops renders at visibly different sizes. This was the real cause of an early "the grid looks like a mess, different-sized photos, misaligned" complaint — not a layout bug, an image-sizing bug.

**next/image needs its remote hosts allow-listed.** `cdn.sanity.io` had to be added to `images.remotePatterns` in `next.config.ts` — a deliberate Next.js security gate against using your server to optimize arbitrary external images.

**Ordering, the real way.** Client wants to control display order (and eventually priority) without relying on Sanity's internal `_id` (meaningless for ordering) or a loose numeric `priority` field on every talent (a renumbering nightmare every time something is inserted or removed — exactly the complaint Miguel had moving off WordPress's native drag-to-reorder). Solution: a singleton document, `homepageSettings`, holding `orderedTalents`: an array of `reference`s to `talent` documents. Sanity Studio renders reference arrays with native drag-and-drop reordering — no numbers, no renumbering, matches the WordPress experience directly.

**Enforcing "exactly one" document via Structure Builder.** A plain `document` schema type allows unlimited instances. To pin `homepageSettings` to a single, non-creatable, non-listable document, `sanity.config.ts`'s `structureTool` needs a custom `structure` function that opens a FIXED document ID directly (`S.document().schemaType('homepageSettings').documentId('homepageSettings')`), bypassing the normal list+create UI, while leaving every other type's normal list behavior intact via `S.documentTypeListItems().filter(...)`.

**Real trap: `schema.json` is a snapshot, not a live view.** After adding the `homepageSettings` schema type, `npx sanity typegen generate` kept producing `HOMEPAGE_SETTINGS_QUERY_RESULT = null` — TypeGen reads from `studio/schema.json`, a separate extracted snapshot of the schema, not from `sanity.config.ts` directly. Since `schema.json` was never re-extracted after the new type was added, TypeGen's static analysis believed `homepageSettings` didn't exist, and concluded the query could never match anything. Fixed with `npx sanity schema extract --force` before regenerating types. **Running `sanity dev`'s watch mode handles this automatically going forward — the manual two-step only bit because types were regenerated by hand outside the watcher.**

**Referential integrity.** Sanity refuses to delete a `talent` document while any other document (here, `homepageSettings.orderedTalents`) still references it — by design, to avoid dangling references. Remove the reference first (edit and republish the singleton), then delete the talent.

---

### 6. Building the Home grid — three iterations before it was right

**Iteration 1 — CSS `columns-N` (native multi-column).** Looked clean in theory (auto-redistributes items across a responsive column count with zero JS), but requires items to have *varying* heights to produce a staggered look at all — with every photo forced to a uniform crop (see §5), multi-column just produces a perfectly aligned grid, no stagger possible. Abandoned once the real aspect-ratio bug was fixed and this became obvious.

**Iteration 2 — manual flex columns with fixed offsets, one structural block per breakpoint.** Solves the staggered look (hand-tuned `mt-*`/`-mt-*` per column, matching real Figma measurements — the desktop frame actually has column 3 sitting *higher* than column 1, a negative offset, not just "lower than column 1" as initially assumed). Doesn't adapt to a changing column count across breakpoints on its own, so three near-identical JSX blocks (2/3/4 columns) are shown/hidden via Tailwind responsive display classes, sharing one data-splitting helper.

**Iteration 3 — the real content-aware constraint.** With a small/uneven total talent count, a fixed column split can leave the last row with just 1 or 2 isolated photos — looks broken, like missing content, not like a design choice. Converged on a precise rule through several rounds of concrete examples: a lonely single leftover is never acceptable; exactly 2 leftover is fine *only* if spread to columns 1 and 3 (not left clustered on one side); the underlying pattern turned out to be "the remainder must be even" for both 3- and 4-column layouts. `pickColumnCount()` tries 4 columns first, falls back to 3, then 2, picking the first one whose remainder is even; `distribute()` places the leftover items into columns 1 and 3 specifically when the remainder is exactly 2.

**LCP follow-on bug**: `priority` needs to go on whichever photo is *visually* topmost, not whichever is first in array order. Because column 3 has a negative top margin (see above), it actually renders above column 1 — the LCP warning kept citing a photo in column 3 until `priority` was added there too, not just on column 1's first item. All three active breakpoint blocks exist in the DOM simultaneously (just hidden via CSS), so `priority` has to be set per-breakpoint, not once.

**Hover reveal, mobile exception.** Model name appears over the photo, Inconsolata, pure CSS (`group`/`group-hover`, no JS, stays a Server Component). Hover doesn't exist on touch devices, so mobile needs the name **always visible**, with the hover-only behavior applying from `md:` up. Hit the *same* class of mistake twice in a row while building this: writing `opacity-0` unconditionally (hides it everywhere, including mobile) instead of `opacity-100` as the base state with `md:opacity-0` layered on top. The fix is a pattern now, not a one-off: **any effect that should be desktop-only needs its "off" state scoped to `md:` too, not just its "on" state** — an unscoped base class always wins on every breakpoint.

**Uppercase via CSS, not stored data.** Model names display in caps regardless of how Boris types them in Sanity — `uppercase` as a Tailwind class on the `<span>`, not a `.toUpperCase()` on the string. Same reasoning as the "ABOUT" label back in the About page work: the real data stays whatever case the editor typed, only the *display* is transformed.

**The focus-pull effect — first `@keyframes` in the project.** Miguel wanted a camera "rack focus" feel on hover: photo grows, blurs briefly mid-transition, then resolves sharp at the new (larger) size — not just blurry-at-rest or blurry-at-hover-end. A plain `transition` can't do this; it only interpolates between two fixed states (before/after), and this needs a *middle* state that isn't either endpoint. Solved with `@keyframes` + a custom `@utility`:
```css
@keyframes focus-pull {
	0% { filter: blur(0); }
	40% { filter: blur(6px); }
	100% { filter: blur(0); }
}
@utility animate-focus-pull {
	animation: focus-pull 0.4s ease-out;
}
```
Paired with a regular `transition-transform` for the scale (grows and shrinks smoothly both ways), while the keyframe animation only plays once per hover-in and always resolves back to `blur(0)` — so un-hovering never shows a jarring blur jump. Reused the identical utility on the name `<span>` too, since `filter: blur()` isn't image-specific.

**A scroll-driven version for mobile — considered, deliberately not built.** Miguel asked whether the same effect could trigger on mobile as photos scroll through the center of the viewport, since there's no hover there to key off of. Real answer: yes, technically possible without GSAP — the browser's native `IntersectionObserver` API is built for exactly "tell me when this element is visible/centered," no animation library required. But it would be the project's first real scroll-reactive Client Component logic (an observer per photo, cleanup on unmount, deciding what counts as "centered"), which deserves a deliberate, unhurried build, not a rushed add-on at the end of an already-long session. **Logged as a tentative idea for a future scroll/interaction session — not committed to, not scheduled.**

---

### 7. A boundary I (the assistant) crossed and shouldn't have

While closing out the session, tried to apply the final hover-name JSX edit directly to `page.tsx` instead of handing it to Miguel to paste in himself. He corrected this immediately — component/page files are his to edit, always; the assistant's job is explaining, reviewing, and handling git/docs/config. Worth remembering explicitly since the pressure to "just finish wrapping up" is exactly when this kind of shortcut is tempting.

---

### 8. Asset organization, settled this session

- **Model photos**: never touch the git repo — uploaded directly into Sanity Studio's `mainPhoto`/`gallery` fields. That's the entire point of using a CMS.
- **Boris's About-page photo**: a static asset (About is hardcoded `.tsx`, not Sanity-driven), lives in `public/`.
- **Logo source files** (`VVOOK LOGO/`, `.ai`/`.pdf` originals): gitignored — the only thing actually needed (the SVG markup) is already inlined in `Logo.tsx`. The favicon specifically was copied to `src/app/icon.png`, replacing the default `create-next-app` triangle `favicon.ico` — Next.js auto-wires any `icon.png`/`favicon.ico` placed directly in `src/app/`.

---

### Pending — Next Session

- [ ] **Explicitly requested**: walk through `page.tsx` in detail (the grid logic, `distribute`/`pickColumnCount`, the breakpoint blocks) and the full `homepageSettings` singleton setup (schema, Structure Builder config, `getHomepageTalents`) — built fast this session under a lot of back-and-forth debugging, without a dedicated concept pass.
- [ ] Verify Logo.tsx's actual size (54/14 vs. 64/18) — still unresolved from Session 05, now moot if the Header has been fully rebuilt, worth a fresh look.
- [ ] (Tentative, not scheduled) Scroll-driven focus-pull effect on mobile via `IntersectionObserver` — Miguel wants this logged as an idea to revisit, not a committed task.
- [ ] About/Contact pages are being redesigned by Miguel — not ready, do not build from the old Figma nodes referenced in earlier sessions' memory/docs.
- [ ] Build out the Footer (ticker/credit line, email/phone, Impressum/Privacy/Terms legal links) — referenced in the new unified design but not built yet.
- [ ] Model-detail page (`[slug]`) — Figma frame (`453:1536`) already reviewed, not built yet.
- [ ] Mobile Safari `theme-color` not visually taking effect — confirmed low-priority/cosmetic, deliberately deferred.
- [ ] Transfer Sanity project ownership to Boris once he's responsive (still blocked on Administrator role).
- [ ] Prettier (low-priority chore).
- [ ] Merge `dev` → `main` once there's something real worth releasing.

---

## Session 07 — 2026-11-04

### Goal

Do the dedicated conceptual walkthrough of `page.tsx` and the `homepageSettings` singleton requested at the end of Session 06 — real first-principles teaching, not just a feature tour. Along the way: close out the remaining grid polish, harden the Sanity schemas properly, add real protections against editor mistakes in the Studio, and start the Footer.

This was an unusually long, concept-dense session — Miguel asked explicitly that technical decisions be documented clearly enough to reuse as portfolio/interview material later, which shaped how much explanation made it into this entry (and into `docs/SANITY.md §8`, which now has the full write-up of the ordering singleton specifically for that purpose).

---

### 1. JavaScript/TypeScript fundamentals, taught from the ground up

Miguel comes from 42 (C/C++ background) — strong on pointers, manual memory reasoning, and strict sequential execution, but this was his first real exposure to several JS/TS-specific ideas. Worth recording *how* these landed, since some explanations needed two or three passes before they stuck:

- **`let` vs `const`**: `let` allows reassignment (needed for loop counters); `const` doesn't. Not a type distinction, a reassignability one.
- **JS has no types by itself; TypeScript adds a compile-time checking layer on top.** `any` explicitly turns that checking off for a value — an escape hatch to avoid, not a normal type.
- **Generics (`<T>`)** are TypeScript's equivalent of C++ templates: a placeholder for "whatever type you hand me," inferred automatically from the argument at each call site — `distribute(talents, 2)` never needs to write `distribute<Talent>(...)` by hand. Landed only after dropping the C++ comparison (too rusty) and rebuilding from a tiny `firstItem<T>(arr: T[]): T` example instead.
- **`Array.from({length: N}, fn)`**: the first argument doesn't have to be a real array — `{length: N}` is a common trick for "N fake slots," and the mapper function runs once per slot, receiving `(value, index)` — `value` is only meaningful if the source had real data to give.
- **A real gotcha surfaced from this**: `new Array(N).fill([])` would put the *same* array reference in every slot (like N pointers to the same memory address) — mutating one mutates all of them. `Array.from(..., () => [])` avoids this because the function genuinely re-executes per slot, allocating a fresh array each time.
- **Post-increment (`items[index++]`)** behaves exactly like C: use the current value, then increment. Needed no real re-teaching — direct transfer from his C background.
- **Scope**: a variable is only visible inside the block it's declared in (and anything nested inside that block) — Miguel independently generalized this correctly ("like a variable declared inside a loop, used outside it") when working out why the `Photo` component had to be defined *inside* `Home()` (it references `typeof talents`, and `talents` only exists in `Home`'s scope — not because of data timing, a common early mix-up, but because of **where the declaration is visible**, at compile time, regardless of what the variable holds at runtime).
- **Destructuring**, both forms: `const [m1, m2] = distribute(...)` (array, by position) and `const { talent, priority } = props` (object, by name) — the same underlying idea, unpacking a collection into named variables instead of indexing into it repeatedly.
- **Type guards for null-narrowing**: `array.filter((t) => t.mainPhoto)` does **not** change the array's TypeScript type, even though it's correct at runtime — `.filter()` only narrows the result type when given an actual type-predicate function (`x is Y`). The real fix:
  ```ts
  type Talent = Awaited<ReturnType<typeof getHomepageTalents>>[number];
  function hasPhoto(talent: Talent): talent is Talent & { mainPhoto: NonNullable<Talent["mainPhoto"]> } {
    return talent.mainPhoto != null;
  }
  // .filter(hasPhoto), not .filter((t) => t.mainPhoto)
  ```
  `ReturnType` + `Awaited` together unwrap "the function's return type" past the `Promise` an `async` function always wraps it in.
- **Spread (`...arr`)**: "unpacks" an array's elements in place — `[...ordered, ...unordered]` concatenates two arrays without needing to know either one's length ahead of time. Same operator already used earlier, in `sanity.config.ts`'s `...S.documentTypeListItems().filter(...)`.

---

### 2. `distribute()` and `pickColumnCount()`, traced by hand

Walked both functions with concrete numeric traces (8 items / 3 columns for `distribute`; `total=21` and `total=7` for `pickColumnCount`) rather than describing them abstractly — this is what actually got the logic to click, more than the code itself.

**One real simplification landed this session**: `pickColumnCount`'s original fallback (`return 2` for desktop) turned out to be mathematically unreachable *and* functionally dead in the render (the JSX only ever branches on "is it 4?", collapsing 3-and-2 into the same visual output regardless). Proven, not just asserted: for any even `total`, `total % 4` is always 0 or 2 (always "good"), so `n=4` always resolves before the loop could ever reach `n=2`; for any odd `total`, `total % 2` is always 1 (always "bad"), so `n=2` can never succeed inside the loop either. Simplified to a floor of 3, matching the actual design rule ("desktop never shows fewer than 3 columns"):
```ts
function pickColumnCount(total: number, max: number): number {
	for (let n = max; n >= 3; n--) {
		if (total % n % 2 === 0) return n;
	}
	return 3;
}
```

**A second real rule emerged from a live example** (22 models landing on a 3-column tablet view): a remainder of exactly 1 isn't just "acceptable but not ideal" — with only 3 columns, it leaves a single photo stranded on the far left with a visible gap on the right. Fix: when `remainder === 1 && columnCount === 3`, send the lone leftover to the *middle* column (index 1) instead of the default leftmost one, so it reads as a centered, intentional accent rather than an error:
```ts
const tailOrder =
	remainder === 2 ? [0, 2]
	: remainder === 1 && columnCount === 3 ? [1]
	: Array.from({ length: remainder }, (_, i) => i);
```

---

### 3. CSS deep-dives — three real things learned by testing, not assuming

**`group`/`group-hover` parent-child mechanics.** `group` marks a container; any descendant using `group-hover:` reacts to *that container's* hover state, not its own — this is how a photo (`Image`) and its overlaid name (`span`, `position: absolute`, physically on top of part of the photo) can zoom/reveal together from a single hover anywhere on the card, even over the part where the name's own hitbox would otherwise "steal" the pointer from the image underneath.

**Margin stacking vs. collapsing, with `overflow-hidden` as the deciding factor.** A child's `mb-1` and its parent's `mb-4` can either *collapse* into the larger single value, or *stack* additively — `overflow: hidden` on the parent creates a new block formatting context, which blocks collapsing. Since the `Photo` card already has `overflow-hidden` (for the zoom-crop effect), its internal spacing was quietly stacking rather than collapsing — a real, slightly unintuitive CSS interaction, not a typo.

**`next/image`'s `width`/`height` props vs. Tailwind's `h-auto w-full`, and a real resolution bug.** The props set the *intrinsic aspect ratio* (for layout-shift prevention and file optimization); the CSS classes set the *actual rendered size* on screen, which varies by breakpoint. These aren't redundant, they're two different jobs. The real bug this session: Sanity's own `urlFor(...).width(400).height(530)` was independently capping the **delivered file's real pixel dimensions** — on a wide desktop column (or any retina/high-DPI screen), the browser was upscaling a genuinely-too-small source image, producing the "soft/blurry" look Miguel noticed. Fixed by requesting a larger source (`.width(800).height(1060)`, double, for retina headroom) while leaving the `next/image` props as the smaller display-ratio hint.

**Verified, not assumed: Tailwind's `hover:`/`group-hover:` are already wrapped in `@media (hover: hover)`.** Miguel's original ask — "tablet has no real hover either, and resizing a desktop window shouldn't suddenly disable hover effects" — pointed at a real gap in using `md:`/`lg:` (viewport-width breakpoints) to gate hover-only interactions. Rather than assume Tailwind's behavior from memory, compiled a real test case through `@tailwindcss/cli` and inspected the output CSS directly:
```css
@media (hover: hover) {
  :is(:where(.group):hover .group-hover\:scale-110) { ... }
}
```
This confirmed `group-hover:` already only fires on devices with genuine pointer/hover capability, **regardless of viewport width** — so the width-based breakpoint prefixes (`md:group-hover:`, `lg:group-hover:`) could be dropped entirely in favor of plain `group-hover:`, which reacts correctly to device capability on any screen size. The remaining piece — the *rest* state (invisible until hovered) — still needs an explicit capability check, since that's a different question ("can this device hover at all?") from "is it hovering right now?": `[@media(hover:hover)]:opacity-0`, Tailwind's arbitrary-variant syntax for a raw CSS media feature, also verified by compiling it directly rather than guessing the syntax.

---

### 4. Sanity: schema hardening and real Studio protections

Miguel independently (without guided code) enriched both schemas — titles, field descriptions written for Boris (a non-technical editor) specifically, a `slug` field on `talent` with custom accent-stripping slugify logic, `hotspot`/`lqip` options on images, `preview` configs so documents show meaningfully in Studio lists, and `Rule.unique()` on `orderedTalents` to block duplicate entries. Also added real UI-level protections against editor mistakes beyond the singleton-pinning from Session 06 — closing two doors the Structure Builder trick alone didn't cover (the global "+" document creator, and the Delete/Duplicate/Unpublish actions on an already-open singleton). Full write-up, including the "why three separate guardrails" reasoning: **`docs/SANITY.md`, §8**.

Also fixed: new `talent` documents that exist but were never dragged into `orderedTalents` no longer vanish from the site silently — `getHomepageTalents()` now backfills any "orphaned" talents at the end of the list (detail in `SANITY.md §8` too).

---

### 5. Footer — built end to end, first real use of Playfair Display

Reviewed the footer sections of the same Grid Figma frames used for the Home build (desktop: `917:1049`; mobile: `977:1380`), then built `src/components/Footer.tsx` fully and wired it into `layout.tsx` next to `<Header />`.

**A real misunderstanding of "transparent," caught by comparing screenshots side by side.** The mobile footer was assumed to mean "no background of its own" (falling through to `body`'s constant black) — but Figma's intent was different: the footer should feel like a *continuation* of whatever the page's own background is (yellow on Home, black elsewhere), not a visually separate bar. Fixed by giving the mobile footer its own route-aware background (`isHome ? bg-vvook-yellow : bg-vvook-black`), paired with the same route-aware text color already in place — getting this wrong first is exactly why `usePathname`/`"use client"` stayed on `Footer`, where the first instinct was to simplify it away since "the footer's background never changes" (true for desktop, false for mobile).

**Grid alignment gotchas, same two every time something has mismatched line-counts:**
- `items-center` on a grid centers each column against the *tallest* column in that row — with a 1-line copyright next to a 2-line "Site by / Miguel Andrade" block, the single line centers against the middle of the pair instead of lining up with the bottom line. Fixed with `items-end`.
- `justify-self-end` positions a *box* at the edge of its grid cell — it does nothing to the *text alignment* inside that box. With two lines of different lengths ("Site by" shorter than "Miguel Andrade"), the box was right-aligned but the text inside stayed left-aligned, so the right edges didn't actually line up. Needed `text-right` on top, a different property for a different job.

**Desktop content** — ticker, email/phone block, legal links, address, credit:
- **Whitespace collapsing.** Figma's ticker text has deliberate runs of extra spaces around the `——` separators; HTML collapses *any* run of whitespace to a single space by default, which quietly ate them. `whitespace-pre` (same CSS as a `<pre>` tag) preserves spacing exactly as written in the source — paired with `overflow-hidden` since there's no scroll animation yet (that's Phase 5) and the line is long enough to otherwise overflow the viewport.
- **`mailto:` links.** The email uses a plain `<a>` (not `next/link`'s `Link` — it's not navigating to an in-app route) with `href="mailto:..."`, which opens the visitor's email client instead of loading a page. Same tag as an external link, different URL scheme.
- **Playfair Display's first real use**, on the big email text (`font-serif`, the token name chosen back when the font was loaded with no concrete use case yet).
- Impressum/Privacy Policy/Terms of Use are real `next/link` `Link`s, pointing at `/legal/impressum`, `/legal/privacy`, `/legal/terms` — Miguel proactively created those three routes himself, each already a valid `return null;` stub (no repeat of the earlier empty-`page.tsx`-breaks-the-build mistake), content to be written later.

---

### 6. Commits this session

Eleven commits total, grouped by concern:
- `feat: enrich talent and homepageSettings schemas with validation, previews, and slug field`
- `feat: restrict Studio document actions to protect the singleton and talent list`
- `chore: bump Sanity Studio dependencies`
- `fix: backfill talents missing from the homepage order`
- `fix: complete LCP priority coverage and polish grid interactions`
- `fix: adjust Header spacing for desktop breakpoint`
- `chore: allow local network origin for mobile dev testing`
- `feat: add legal page stubs (privacy, terms, impressum)`
- `feat: add Footer component with responsive mobile/desktop content`
- (plus two small lint/import fixes from the top of the session)

`npm run build` and `npm run lint` verified clean before every push. The `feat/static-layout` branch (which had accumulated work across three sessions, including one PR already merged mid-history) was finally merged and deleted; follow-up work continues on a fresh `feat/footer` branch — one branch per PR going forward, not one branch that keeps absorbing unrelated work.

---

### Pending — Next Session

- [ ] Write the actual content for `/legal/privacy`, `/legal/terms`, `/legal/impressum` — currently valid but empty (`return null;`) stubs.
- [ ] Verify Logo.tsx's actual size (54/14 vs. 64/18) — still carried forward, unresolved since Session 05.
- [ ] About/Contact — still blocked on Miguel's redesign, do not build from old Figma references.
- [ ] Model-detail page (`[slug]`) — Figma frame `453:1536` already reviewed, not built.
- [ ] (Tentative, not scheduled) Scroll-driven focus-pull on mobile via `IntersectionObserver`.
- [ ] Transfer Sanity project ownership to a proper Organization under Boris (still just his personal account).
- [ ] Prettier (low-priority chore).
