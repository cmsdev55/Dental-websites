/**
 * Convert a CSV (columns: Business, City, State, Phone, Contact, Rating, Reviews) into data/practices.json.
 *
 *   npm run import:csv -- leads.csv                      merge: update matching slugs, add new ones,
 *                                                        keep anything you edited by hand (theme, years, hours…)
 *   npm run import:csv -- leads.csv --replace            start practices.json from scratch
 *   npm run import:csv -- leads.csv --template lumen     give every NEW practice this design
 *                                                        (editorial | lumen | studio | atelier)
 *   npm run import:csv -- leads.csv --theme teal         give every NEW practice this color theme (Editorial design)
 *   npm run import:csv -- leads.csv --contact-as-doctor  treat every Contact as the dentist's name
 *
 * By default a Contact is only shown as the doctor when it looks like one ("Dr. …", "… DDS", "… DMD"),
 * so an office manager is never presented as a dentist. Other contacts are kept in a `contact` field
 * that the website ignores.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const TEMPLATES = ["editorial", "lumen", "studio", "atelier"] as const;
type Template = (typeof TEMPLATES)[number];
const THEMES = ["navy", "teal", "sand", "sage"] as const;
type Theme = (typeof THEMES)[number];
type Entry = Record<string, unknown> & { slug: string };

const OUTPUT = resolve("data/practices.json");

const COLUMNS = {
  name: ["business", "business name", "name", "practice"],
  city: ["city"],
  state: ["state", "region"],
  phone: ["phone", "phone number", "telephone"],
  contact: ["contact", "doctor", "dentist"],
  rating: ["rating", "stars"],
  reviews: ["reviews", "review count", "reviews count"],
} as const;

/* ------------------------------------------------------------------ */

function parseArgs(argv: string[]) {
  const args = {
    file: "",
    replace: false,
    contactAsDoctor: false,
    theme: undefined as Theme | undefined,
    template: undefined as Template | undefined,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--replace") args.replace = true;
    else if (arg === "--contact-as-doctor") args.contactAsDoctor = true;
    else if (arg === "--theme") {
      const theme = argv[++i] as Theme;
      if (!THEMES.includes(theme)) fail(`--theme must be one of: ${THEMES.join(", ")}`);
      args.theme = theme;
    } else if (arg === "--template") {
      const template = argv[++i] as Template;
      if (!TEMPLATES.includes(template)) fail(`--template must be one of: ${TEMPLATES.join(", ")}`);
      args.template = template;
    } else if (!arg.startsWith("--")) args.file = arg;
    else fail(`Unknown option ${arg}`);
  }
  if (!args.file) {
    fail("Usage: npm run import:csv -- path/to/file.csv [--replace] [--template lumen] [--theme navy] [--contact-as-doctor]");
  }
  return args;
}

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/** RFC 4180 CSV: quoted fields, escaped quotes (""), commas and newlines inside quotes, CRLF, BOM. */
function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim()));
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return local.length === 10 ? `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}` : raw.trim();
}

function parseRating(raw: string): number | undefined {
  const n = Number.parseFloat(raw.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 && n <= 5 ? Math.round(n * 10) / 10 : undefined;
}

function parseReviews(raw: string): number | undefined {
  const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

const looksLikeDentist = (contact: string) => /^dr\.?\s/i.test(contact) || /\b(dds|dmd)\b/i.test(contact);

function hash(value: string): number {
  let h = 0;
  for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/** Stable per-slug picks, so re-imports never reshuffle a practice's design or colors. */
const themeFor = (slug: string): Theme => THEMES[hash(slug) % THEMES.length];
const templateFor = (slug: string): Template => TEMPLATES[hash(`${slug}:template`) % TEMPLATES.length];

/** Fixed key order keeps practices.json diffs readable. */
function ordered(entry: Entry): Entry {
  const keys = ["slug", "name", "city", "state", "phone", "doctor", "rating", "reviews", "years", "address", "hours", "template", "theme", "contact"];
  const out: Entry = { slug: entry.slug };
  for (const key of keys) if (entry[key] !== undefined) out[key] = entry[key];
  for (const key of Object.keys(entry)) if (!(key in out) && entry[key] !== undefined) out[key] = entry[key];
  return out;
}

/* ------------------------------------------------------------------ */

const args = parseArgs(process.argv.slice(2));
const csvPath = resolve(args.file);
if (!existsSync(csvPath)) fail(`Can't find ${csvPath}`);

const [header, ...rows] = parseCsv(readFileSync(csvPath, "utf8"));
if (!header) fail("The CSV is empty.");

const normalizedHeader = header.map((h) => h.trim().toLowerCase());
const column = Object.fromEntries(
  Object.entries(COLUMNS).map(([key, aliases]) => [key, normalizedHeader.findIndex((h) => (aliases as readonly string[]).includes(h))]),
) as Record<keyof typeof COLUMNS, number>;

for (const key of ["name", "city", "state", "phone"] as const) {
  if (column[key] === -1) fail(`Missing a "${COLUMNS[key][0]}" column. Found: ${header.join(", ")}`);
}

const existing: Entry[] = !args.replace && existsSync(OUTPUT) ? JSON.parse(readFileSync(OUTPUT, "utf8")) : [];
const bySlug = new Map(existing.map((e) => [e.slug, e]));
const usedThisRun = new Set<string>();
const stats = { added: 0, updated: 0, skipped: 0 };
const notDoctors: string[] = [];

rows.forEach((cells, i) => {
  const cell = (key: keyof typeof COLUMNS) => (column[key] >= 0 ? (cells[column[key]] ?? "").trim() : "");
  const name = cell("name");
  const city = cell("city");
  const state = cell("state");
  const phone = cell("phone");

  if (!name || !city || !state || !phone) {
    console.warn(`  ↷ Row ${i + 2} skipped (needs Business, City, State and Phone): ${cells.join(", ")}`);
    stats.skipped++;
    return;
  }

  // Same name twice in one CSV (e.g. two locations)? Add the city, then a counter.
  let slug = slugify(name);
  if (usedThisRun.has(slug)) slug = slugify(`${name} ${city}`);
  for (let n = 2; usedThisRun.has(slug); n++) slug = `${slugify(`${name} ${city}`)}-${n}`;
  usedThisRun.add(slug);

  const contact = cell("contact");
  const isDoctor = Boolean(contact) && (args.contactAsDoctor || looksLikeDentist(contact));
  if (contact && !isDoctor) notDoctors.push(`${name}: "${contact}"`);

  const fromCsv: Entry = {
    slug,
    name,
    city,
    state: state.toUpperCase().length === 2 ? state.toUpperCase() : state,
    phone: formatPhone(phone),
    doctor: isDoctor ? contact : undefined,
    contact: contact && !isDoctor ? contact : undefined,
    rating: parseRating(cell("rating")),
    reviews: parseReviews(cell("reviews")),
  };

  const previous = bySlug.get(slug);
  if (previous) {
    // Non-empty CSV values win; everything else you edited by hand (theme, doctor, years, hours…) is kept.
    const filled = Object.fromEntries(Object.entries(fromCsv).filter(([, v]) => v !== undefined));
    bySlug.set(
      slug,
      ordered({
        ...previous,
        ...filled,
        slug,
        template: previous.template ?? args.template ?? templateFor(slug),
        theme: previous.theme ?? args.theme ?? themeFor(slug),
      }),
    );
    stats.updated++;
  } else {
    bySlug.set(slug, ordered({ ...fromCsv, template: args.template ?? templateFor(slug), theme: args.theme ?? themeFor(slug) }));
    stats.added++;
  }
});

const practices = [...bySlug.values()];
writeFileSync(OUTPUT, `${JSON.stringify(practices, null, 2)}\n`);

console.log(`\n✔ ${OUTPUT}`);
console.log(`  ${stats.added} added · ${stats.updated} updated · ${stats.skipped} skipped · ${practices.length} total\n`);
if (notDoctors.length) {
  console.log("  These contacts don't look like dentists, so they're stored as `contact` and not shown on the site");
  console.log("  (re-run with --contact-as-doctor to use them anyway):");
  for (const line of notDoctors) console.log(`    · ${line}`);
  console.log("");
}
console.log("  Preview URLs:");
for (const p of practices) console.log(`    /preview/${p.slug}/  (${p.template ?? "editorial"})`);
console.log("");
