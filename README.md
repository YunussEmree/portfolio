# Yunus Emre Şenyiğit — Portfolio

Personal portfolio site for **Yunus Emre Şenyiğit**, Backend Developer based in Antalya, Turkey.

**Live:** [yunusemresenyigit.dev](https://yunusemresenyigit.dev) <!-- update when deployed -->

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, static export) |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| Animations | Framer Motion v12 + Lenis smooth scroll |
| Icons | lucide-react |
| Language | TypeScript |

---

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

---

## Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx       # Root layout — SEO metadata, ThemeProvider
│   ├── page.tsx         # Home page (assembles all sections)
│   └── globals.css      # Tailwind import + dark mode variant
├── components/
│   ├── ThemeProvider.tsx # Dark/light mode state & localStorage
│   ├── ThemeToggle.tsx   # Sun/Moon toggle button (used in Navbar)
│   ├── SmoothScroll.tsx  # Lenis wrapper
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx         # Services/overview (id="about")
│   ├── Skills.tsx
│   ├── Experience.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── SectionTitle.tsx
├── data/                 # ← Edit these to update content
│   ├── profile.ts        # Name, role, bio, social links, availability
│   ├── experiences.ts    # Work experience (newest first)
│   ├── projects.ts       # Project list
│   ├── skills.ts         # Skill categories with accent colors
│   └── services.ts       # Overview/service cards
├── lib/
│   ├── animations.ts     # Reusable Framer Motion variants
│   └── scroll.ts         # scrollToId helper
├── types.ts              # Shared TypeScript types
└── public/
    ├── profile.jpg
    └── logos/            # Company logos used in Experience section
```

---

## Updating Content

All content lives in `data/`. No component edits needed for content changes.

### Profile & Bio — `data/profile.ts`
```ts
export const PROFILE = {
  name: "...",
  role: "...",
  bio: "...",          // also used as meta description
  email: "...",
  github: "...",
  linkedin: "...",
  available: true,     // shows/hides the "Open to opportunities" badge
};
```

### Experience — `data/experiences.ts`
Add entries to the array (newest first). `logo` is optional — falls back to a building icon.
```ts
{
  role: "Backend Developer",
  company: "Acme Corp",
  logo: "/logos/acme.png",   // place file in public/logos/
  period: "Jan 2025 – Present",
  points: ["Did X", "Built Y"],
}
```

### Skills — `data/skills.ts`
Accent options: `"blue" | "violet" | "emerald" | "orange" | "cyan" | "rose"`
```ts
{ name: "Backend", accent: "blue", skills: ["Spring Boot", "NestJS"] }
```

### Projects — `data/projects.ts`
Use `"#"` for `live` or `repo` if the link doesn't exist.

---

## Dark / Light Mode

Theme defaults to **dark**. Preference is persisted in `localStorage`.

- Toggle button in the Navbar (Sun / Moon icon)
- No flash on reload — an inline script in `<head>` applies the class before first paint
- Implemented with Tailwind v4 `@custom-variant dark` (class-based, not `prefers-color-scheme`)

---

## SEO

Metadata is defined in `app/layout.tsx` and pulls from `data/profile.ts`:

- `<title>`, `<meta name="description">`, Open Graph, Twitter Card
- `rel=canonical` (set `NEXT_PUBLIC_SITE_URL` env var for production)
- `robots: index + follow`

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://yunusemresenyigit.dev
```

---

## Adding a New Section

1. Create `components/NewSection.tsx` with `"use client"` and `id="section-id"`
2. Add to `app/page.tsx`
3. Add `{ label: "Section", id: "section-id" }` to `navItems` in `Navbar.tsx`
4. Add a data file in `data/` if needed

---

## Performance (Lighthouse — localhost, no throttling)

| Category | Score |
|---|---|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
