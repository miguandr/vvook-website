# Sanity — How It Works In This Project

Reference notes for the Sanity integration: what each piece does, why it's shaped this way, and how data flows from the Studio to the website. Written as a study reference, not a changelog — see `STEPS.md` for the chronological session log.

---

## 1. What Sanity actually is

Sanity is a **headless CMS** — content editor + database, with zero opinion about how the site looks.

Compare to WordPress: WordPress bundles the editor and the rendering into one system (PHP reads the database and builds the HTML, every request). Sanity splits that in two:

- **Sanity Studio** — the editor Boris uses (a web app, just for editing content)
- **Our Next.js app** — asks Sanity for that data over an API and decides how to render it

Two independent systems, talking over an API — not one bundled thing. This is also why a WordPress site has a much bigger attack surface (database, login panel, PHP running per-request) than ours does.

---

## 2. Standalone Studio, not embedded

**Decision:** the Studio lives in its own folder, `studio/`, as its own independent app — not mounted inside the Next.js app at a `/studio` route (the original plan, reversed once we read Sanity's current guidance).

**Why standalone wins:**
- `sanity dev`/`sanity build` run on Vite — 10-30x faster than compiling the Studio through Next.js
- Auto-updates: standalone Studios get bugfixes/features automatically. Embedded ones need a manual dependency bump + redeploy every time
- TypeGen watches and regenerates types live while `sanity dev` runs. Embedded requires re-running it by hand after every query edit

**Cost of two dev servers:** while developing, you run both at once, in separate terminals:
```bash
# Terminal 1 — from repo root
npm run dev          # Next.js, localhost:3000

# Terminal 2 — from studio/
npm run dev          # Sanity Studio, localhost:3333
```

---

## 3. Where everything lives

```
new_website/
├── studio/                        ← standalone Sanity app, own package.json
│   ├── schemaTypes/
│   │   ├── talent.ts              ← the actual field definitions
│   │   └── index.ts               ← aggregates all schema types into one array
│   ├── sanity.config.ts           ← registers the schema, builds the Studio
│   ├── sanity.cli.ts              ← project connection + TypeGen configuration
│   └── schema.json                ← generated snapshot of the schema (see §5)
│
├── src/sanity/lib/
│   ├── client.ts                  ← configured connection used to fetch data
│   └── queries.ts                 ← GROQ queries, written by hand
│
└── sanity.types.ts                ← generated TypeScript types (see §5)
```

`src/sanity/` sits next to `src/app/`, not inside it — `app/` is reserved for routes only.

---

## 4. The `talent` schema

```ts
// studio/schemaTypes/talent.ts
export default defineType({
  name: 'talent',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'mainPhoto', type: 'image', validation: (Rule) => Rule.required() }),
    defineField({ name: 'gallery', type: 'array', of: [{ type: 'image' }] }),
    defineField({ name: 'height', type: 'number' }),
    defineField({ name: 'chest', type: 'number' }),
    defineField({ name: 'waist', type: 'number' }),
    defineField({ name: 'hips', type: 'number' }),
    defineField({ name: 'shoes', type: 'number' }),
    defineField({ name: 'suit', type: 'number' }),   // suit size, menswear bookings
    defineField({ name: 'dress', type: 'number' }),  // dress size, womenswear bookings
  ],
})
```

**Deliberately excluded: no gender/category field.** Two dead ends got ruled out along the way, worth remembering *why*:
1. Reviving the old project's Women/Men/Commercial taxonomy — explicitly out of scope, this is a different design
2. Using `suit`/`dress` presence as an implicit gender signal (fill one, leave the other empty) — breaks on real data (a shirtless talent has neither filled) and hides a categorization decision behind an unrelated field name

`suit`/`dress` really are just optional wardrobe sizing for booking, independent of each other, same spirit as `shoes`.

**Field type notes:**
- `array` + `of: [{ type: 'image' }]` for *multiple* photos. Plain `image` is a single photo.
- `reference` + `to: [{ type: '...' }]` is how you'd point at another document (not used yet, but this is the pattern for e.g. a future category or featured-grid document).
- Fields are optional by default. `validation: (Rule) => Rule.required()` is opt-in, added only to `name` and `mainPhoto`.
- `export default` in front of `defineType({...})` is mandatory — without it, the file computes a value and throws it away silently.

**One schema, multiple queries.** `talent` will power both the grid (name + mainPhoto only) and the future detail page (every field). The schema name describes what the *data is* (a talent), never what page happens to use it — don't rename it to something page-specific like `talent_grid`.

---

## 5. Connecting Next.js: client, queries, and how data flows

### The client

```ts
// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'w0ka7cdd',
  dataset: 'production',
  apiVersion: '2026-08-18',
  useCdn: true,
})
```

- `dataset: 'production'` — a Sanity project can hold multiple isolated content datasets (think separate environments). We only need one right now.
- `apiVersion` — Sanity's API is versioned by date, not semantic version numbers. Locks in "the API as it behaved on this date" so an update on Sanity's side can't silently change your response shape.
- `useCdn: true` — fast, cached (brief delay after edits). `false` is for cases needing guaranteed-fresh data (e.g. `generateStaticParams`, webhooks) — not the default.

`projectId`/`dataset` are read from environment variables (`NEXT_PUBLIC_` prefix — needed if this value is ever read client-side too, e.g. for Visual Editing later; without the prefix Next.js keeps it server-only):
```ts
projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
```
Set in `.env.local` (real values, gitignored) and mirrored empty in `.env.example` (committed, documents what's needed).

### Queries — GROQ

Sanity's query language. Core syntax: `*` = all documents, `[filter]` = which ones, `{ }` = which fields (a "projection").

```ts
// src/sanity/lib/queries.ts
import { defineQuery } from 'next-sanity'

export const TALENT_GRID_QUERY = defineQuery(`*[_type == "talent"]{ name, mainPhoto }`)
```

Must use `defineQuery` (or the `groq` tag), not a plain template string — TypeGen only detects queries wrapped this way, and `defineQuery` is also what makes automatic result-typing possible (see below).

### Using it in a Server Component

```tsx
// src/app/page.tsx
import { client } from '@/sanity/lib/client'
import { TALENT_GRID_QUERY } from '@/sanity/lib/queries'

export default async function Home() {
  const talents = await client.fetch(TALENT_GRID_QUERY)
  return <pre>{JSON.stringify(talents, null, 2)}</pre>
}
```

Server Components can be `async` and `await` directly — no `useEffect`, no loading state. The fetch runs on the server, before any HTML reaches the browser, so the data is already baked in by the time the page arrives. Same underlying reason Next.js was chosen over a plain client-side React app (see `STEPS.md`, Session 01).

### TypeGen — closing the loop

TypeScript can't see inside a remote database. It only knows what's visibly written in code — so without help, `talents` above would just be typed `any`. TypeGen bridges that gap by generating real types from the actual schema and actual queries.

**Two separate inputs feed one output — not a single chain:**

```
schemaTypes/talent.ts  →  registered in sanity.config.ts
                                  ↓
                  `sanity schema extract`
                                  ↓
                           schema.json
                                  ↓
queries.ts (scanned via `path`)  →  `sanity typegen generate`
                                  ↓
                        sanity.types.ts
```

- `schema.json` comes from the **schema** (via extract). `queries.ts` is scanned **separately**, directly from the source files.
- `sanity.config.ts` is *not* generated from `schema.json` — it's the reverse. `sanity.config.ts` is where the schema gets registered (imports `schemaTypes`, builds the actual Studio); `schema.json` is a portable snapshot *exported from* that registration.
- `queries.ts` doesn't read `schema.json` either — it's written by hand, based on what the schema is known to contain.

**Configuration** (`studio/sanity.cli.ts`):
```ts
export default defineCliConfig({
  api: { projectId: 'w0ka7cdd', dataset: 'production' },
  deployment: { autoUpdates: true },
  typegen: {
    enabled: true,                          // regenerates automatically during `sanity dev`/`build`
    path: '../src/**/*.{ts,tsx}',           // where to scan for defineQuery(...) calls
    schema: 'schema.json',                  // the extracted schema snapshot
    generates: '../sanity.types.ts',        // output file
    overloadClientMethods: true,            // makes client.fetch(TALENT_GRID_QUERY) auto-typed, no manual import needed
  },
})
```
Note this whole block goes **inside** `defineCliConfig({...})`, as a sibling to `api`/`deployment` — not as a standalone statement floating outside it.

**Why `sanity.types.ts` has ~13 types when we only wrote one schema:** `talent` is ours, but `mainPhoto`/`gallery` use Sanity's own built-in image types (`SanityImageAsset`, hotspot, crop, etc.) — those come free with any `image` field, not hand-written.

**First-time manual step:** the automatic watch mode needs `schema.json` to already exist once before it can watch it:
```bash
cd studio
npx sanity schema extract
```
After that, `sanity dev` keeps both `schema.json` and `sanity.types.ts` up to date on its own.

**tsconfig requirement:** the root `tsconfig.json`'s `include` needs to actually pick up `sanity.types.ts`. Ours already does, via the existing broad `**/*.ts` glob — no extra entry was needed. (If a project's `include` were scoped narrowly, e.g. `["src/**/*"]`, this file at the repo root would need to be added explicitly.)

---

## 6. Gotchas hit while building this

- `defineType({...})` without `export default` in front — silently does nothing, no error, just nothing shows up in Studio.
- `gallery: { type: 'image' }` only allows one photo. Need `type: 'array', of: [{ type: 'image' }]` for many.
- `category: { type: 'document' }` isn't a real field type. Use `reference` + `to: [{ type: '...' }]`.
- Root `tsconfig.json`'s broad `**/*.ts` include reached into `studio/`'s own separate TypeScript project and tried to typecheck it against the wrong `node_modules` — fixed by adding `"studio"` to `exclude`.
- A `git add studio` can silently stage nothing if run from the wrong directory — always confirm with `git status` before trusting a commit contains what you think it does (this one slipped through once and had to be fixed in a follow-up PR).
- `projectId: 'NEXT_PUBLIC_SANITY_PROJECT_ID'` (a string literal of the variable's *name*) is not the same as `projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID` (the actual *value*). Easy to write the first by accident when first learning env vars.

---

---

## 7. Not done yet

- [x] Move `projectId`/`dataset` into environment variables
- [ ] Extract the `client.fetch(...)` call out of `page.tsx` into its own function — needed before it can be unit tested, since Vitest can't render async Server Components directly
- [ ] First real unit test (mocked Sanity client)
- [ ] `TALENT_DETAIL_QUERY` (or similar) — full fields for a single talent, for the model detail page
- [ ] Image URL builder (`@sanity/image-url`) — `mainPhoto` currently only exposes an internal `_ref`, not a usable URL
- [ ] Transfer the Sanity project from Miguel's personal account to a Sanity Organization owned by Boris
