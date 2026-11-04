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

## 8. Client-controlled ordering — the `homepageSettings` singleton

The Home page grid needs to show models in whatever order Boris wants — "best models first," changeable any time, without a developer. Two options were considered and rejected before landing on this one:

- **A `priority` number on each `talent`** — simple, but inserting or removing a model in the middle means renumbering everything after it by hand. Exactly the WordPress-drag-and-drop experience Boris was used to, lost.
- **Relying on `_id` or creation order** — `_id` is an internal identifier with no meaningful order; it's not something an editor should ever have to think about.

**The actual solution**: a single document, `homepageSettings`, with one field — `orderedTalents`, an `array` of `reference`s pointing at `talent` documents (`studio/schemaTypes/homepageSettings.ts`):

```ts
defineField({
  name: 'orderedTalents',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'talent' }] }],
  options: { layout: 'grid' },
  validation: (Rule) => Rule.unique(),
})
```

Sanity Studio renders an `array` of `reference`s with **native drag-and-drop reordering**, for free, no plugin required — Boris drags models into place directly, no numbers involved anywhere. `Rule.unique()` stops the same model from being dragged into the list twice by accident.

### How the data actually flows — references vs. the data itself

`orderedTalents` stores only **pointers** (`_ref`, an ID) — not the talent's name, photo, or anything else. Querying it and getting back real model data requires **dereferencing**, GROQ's `->` operator:

```groq
*[_type == "homepageSettings"][0]{
  orderedTalents[]->{_id, name, mainPhoto}
}
```

`orderedTalents[]` is the array of pointers; `->` says "go fetch the real document each pointer points at"; `{_id, name, mainPhoto}` is which fields to pull once resolved. Critically, **this dereferencing happens in GROQ, on Sanity's server** — by the time `getHomepageTalents()` gets the response back, it's already a plain array of full `{_id, name, mainPhoto}` objects. The application code never "follows a pointer" itself; it only ever receives already-resolved data. This is the same relationship as a pointer and `*ptr` in C — `orderedTalents` is the array of addresses, `->` is the dereference, except the dereference is performed by the database query itself, not by application code.

### Enforcing "exactly one" document

A plain `document` schema type allows unlimited instances. `homepageSettings` needs exactly one, forever. Sanity has no schema-level "singleton" flag — it's enforced entirely through **Studio UI configuration**, in `studio/sanity.config.ts`, in three separate places (each closing a different door a careless click could open):

1. **Structure Builder pins a fixed document ID**, instead of offering a list-and-create flow:
   ```ts
   structureTool({
     structure: (S) =>
       S.list().title('Content').items([
         S.listItem().title('Homepage Settings').id('homepageSettings')
           .child(S.document().schemaType('homepageSettings').documentId('homepageSettings')),
         S.divider(),
         ...S.documentTypeListItems().filter((item) => item.getId() !== 'homepageSettings'),
       ]),
   })
   ```
   Opening "Homepage Settings" from the sidebar always opens the SAME document (same literal ID `'homepageSettings'`) — since document IDs are unique, a second one can never exist through this path.

2. **`document.newDocumentOptions`** removes `homepageSettings` from Studio's *global* "create new" search (the generic `+` button available everywhere, independent of the custom sidebar menu above):
   ```ts
   document: {
     newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'homepageSettings'),
   }
   ```
   Without this, the sidebar trick alone can be bypassed — the global creator doesn't know or care about the custom Structure menu.

3. **`document.actions`** removes the Delete/Duplicate/Unpublish buttons specifically when viewing a `homepageSettings` document, leaving every other document type (like `talent`) completely untouched:
   ```ts
   document: {
     actions: (prev, { schemaType }) =>
       schemaType === 'homepageSettings'
         ? prev.filter(({ action }) => !action || !['delete', 'duplicate', 'unpublish'].includes(action))
         : prev,
   }
   ```

Three independent guardrails, because Sanity Studio has three independent ways to create or destroy a document — closing only one would still leave the singleton breakable.

### The orphaned-model problem

If Boris creates a new `talent` but forgets to drag it into `orderedTalents`, that model would silently never appear on the site — no error, just missing. `getHomepageTalents()` defends against this by fetching *all* talents separately and appending any that aren't yet in the ordered list, so a forgotten model shows up (at the end) rather than disappearing:

```ts
const [settings, allTalents] = await Promise.all([
  client.fetch(HOMEPAGE_SETTINGS_QUERY),
  client.fetch(TALENT_GRID_QUERY),
]);
const ordered = settings?.orderedTalents ?? [];
const orderedIds = new Set(ordered.map((t) => t._id));
const unordered = allTalents.filter((t) => !orderedIds.has(t._id));
return [...ordered, ...unordered];
```

Also worth remembering: Sanity itself refuses to **delete** a `talent` that's still referenced by `orderedTalents` (dangling-reference protection, built in) — the reference has to be removed from the singleton first, then the talent can be deleted.

---

## 9. Not done yet

- [x] Move `projectId`/`dataset` into environment variables
- [x] Image URL builder (`@sanity/image-url`) — `src/sanity/lib/image.ts`, `urlFor(source).width(N).height(N).url()`
- [ ] Extract the `client.fetch(...)` call out of `page.tsx` into its own function — needed before it can be unit tested, since Vitest can't render async Server Components directly
- [ ] First real unit test (mocked Sanity client)
- [ ] `TALENT_DETAIL_QUERY` (or similar) — full fields for a single talent, for the model detail page
- [ ] Transfer the Sanity project from Miguel's personal account to a Sanity Organization owned by Boris (now Boris's own account directly, per Session 05 — ownership itself still not formally org-based)
