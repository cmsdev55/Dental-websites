# Dental website previews

One Next.js codebase that turns a list of dental practices into personalized, fully animated website
previews at `/preview/<slug>/`. Each practice picks one of four completely different designs, and
everything is exported as static HTML, so it hosts free on Vercel or Cloudflare Pages.

| Template    | Look                                     | Signature graphics                                                                 |
| ----------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `editorial` | Light, refined serif, photographic       | Pinned GSAP "visit" story, canvas sparkles, parallax. Recolor with `theme`.         |
| `lumen`     | Dark, cinematic                          | Real-time WebGL 3D tooth (three.js), canvas particle field, glowing bento grid      |
| `studio`    | Bright, playful, bold                    | Interactive canvas bubble simulation, 3D rotating services ring, stacking cards     |
| `atelier`   | Warm, quiet luxury                       | Canvas silk ribbons, arch frames, cursor image reveals, horizontal scroll journey   |

## Quick start

```bash
npm install
cp .env.example .env.local   # set your agency name
npm run dev                  # http://localhost:3000 lists every preview (dev only)
```

## Adding practices

Edit `data/practices.json` directly, or import a CSV with the columns
`Business, City, State, Phone, Contact, Rating, Reviews`:

```bash
npm run import:csv -- path/to/leads.csv                    # merge (keeps your hand edits)
npm run import:csv -- path/to/leads.csv --template lumen   # give new practices this design
npm run import:csv -- path/to/leads.csv --theme teal       # editorial color theme for new practices
npm run import:csv -- path/to/leads.csv --replace          # start over
```

Each practice:

```jsonc
{
  "slug": "clove-lake-dental",      // URL: /preview/clove-lake-dental/
  "name": "Clove Lake Dental",
  "city": "Staten Island",
  "state": "NY",
  "phone": "(718) 273-1849",
  "template": "editorial",          // editorial | lumen | studio | atelier (default editorial)
  "theme": "navy",                  // navy | teal | sand | sage (Editorial only)
  "doctor": "Dr. Jane Smith",       // optional
  "rating": 4.8,                    // optional
  "reviews": 30,                    // optional
  "years": 12,                      // optional, only if the practice told you
  "address": "123 Main St",         // optional, sharpens the map pin
  "hours": [{ "days": "Monday – Friday", "time": "8:00 AM – 5:00 PM" }] // optional
}
```

Missing optional fields simply hide the related UI. Without `hours`, pages show clearly labeled sample hours.

## Build and deploy

```bash
npm run build      # static export to ./out
npm run preview    # serve ./out locally at http://localhost:3000
```

**Vercel:** push to GitHub, import the repo at vercel.com/new (framework: Next.js, no settings to change),
and add the environment variables from `.env.example`. Or from the terminal: `npx vercel` then `npx vercel --prod`.

**Cloudflare Pages:** build command `npm run build`, output directory `out`.

## Environment variables

| Variable                     | Purpose                                                                    |
| ---------------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_AGENCY_NAME`    | Footer credit: "Website preview by …"                                      |
| `NEXT_PUBLIC_AGENCY_URL`     | Optional link for the credit                                               |
| `NEXT_PUBLIC_SITE_URL`       | Your deployed URL (canonical URLs, share images, JSON-LD)                   |
| `NEXT_PUBLIC_INDEX_PREVIEWS` | `false` by default: previews carry `noindex` until a practice signs off     |

## Honesty rules built in

No invented awards, years, insurance lists, staff names, prices or testimonials. Reviews are labeled
samples with "Patient name"; before/after images, doctor photos, bios and offers carry placeholder
badges; practice names are text wordmarks, never logos; every footer states the page is a concept
preview and not the practice's official site.

## Project layout

```
app/                     routes, global CSS, fonts, share images
components/
  providers/             Lenis smooth scroll + Motion config
  shared/                header variants, menus, booking form, before/after slider, map, hours
  templates/<name>/      one folder per design (sections, canvas/WebGL effects, styles.css)
  ui/                    small animation primitives (reveals, tilt, count-up, magnetic button…)
data/practices.json      the practices
lib/                     data loading, content, images, animation helpers, themes
scripts/import-csv.ts    CSV → practices.json
```
