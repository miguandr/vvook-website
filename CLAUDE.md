# Vvook — Project Context

## What this is
Building the website for **Vvook Management**, a talent/model management agency based in Berlin.
The original site (vvookmanagement.com) ran on WordPress and was taken down after a malware attack.
This is a real client project — the client's name is **Boris**.

## User context
- This is Miguel's **first freelance web project** and **first time using Next.js**.
- He wants to **learn**, not just receive code. Always explain the *how* and *why* before writing anything.
- Walk him through each step. Don't create files without explaining what they do and why they exist.
- When he needs to create a file or run a command, tell him what to do — let him do it.

## Non-negotiables
- **100% responsive** — mobile-first. Every component must work on mobile.
- Tailwind is mobile-first by default (base styles = mobile, `md:` = tablet+, `lg:` = desktop).

## Stack
- **Next.js 15+ (App Router)** — routing, SSR/SSG
- **Tailwind CSS** — styling with design tokens
- **Sanity** — headless CMS (client edits talent profiles, photos, about copy)
- **GSAP** — page transition animations + glitch effect on talent page
- **Netlify** — hosting (chosen for predictable pricing over Vercel)
- **Resend — contact form email handler

## Design direction (from vvook-design-brief.html)
- **Typography**: Bebas Neue (display/logo) · DM Serif Display (headlines) · DM Sans 300 (body/nav)
- **Colors**: `#0A0A0A` black · `#FAFAF7` white · `#F5E642` yellow · `#9A9A8E` mid-gray · `#E8E8E4` gray


## Client design preferences (diverge from brief)

- Current plan: yellow background on **home page**, white on **talent page**.
- Talent page: **GSAP glitch effect** where yellow "tries to come through" the white background
  — representing the brand's bold personality beneath the clean editorial layout.
- Page transitions: animated transition between home ↔ talent that makes the color shift feel intentional.
- Client is **undecided** on home page layout: full talent roster vs. single large hero photo
  (photo swappable by client via Sanity). A prototype is being built to help him decide.

## Pages (5 total)
1. `/` — Home
3. `/[slug]` — Individual talent profile (photos, stats, bio)
4. `/about` — About page
5. `/contact` — Contact form

## What the client can edit in Sanity
- Add / remove talent profiles
- Upload talent photos
- Edit measurements and stats
- Update about page copy
- Update contact info

## Build order


## Key files



## Session log instruction

At the end of each working session, when I say "we're done for today" or similar,
update a file called `/docs/STEPS.md` with a new entry documenting:

- What was done during the session
- Important decisions made and why
- Technologies discussed or adopted with their justification
- Pending next steps

Format each entry like a university fullstack development class —
structured, didactic, with reasoning behind every decision. Not just "what",
but "why". It should serve as both a technical and learning reference.
Include the date in each entry.
