import Link from "next/link";
import { getAllPractices } from "@/lib/practices";
import { siteConfig } from "@/lib/site";

/**
 * The root page lists every preview while you run `npm run dev`.
 * In the exported site it shows a neutral page, so one practice can't browse the others.
 */
export default function Home() {
  const isDev = process.env.NODE_ENV === "development";
  const practices = getAllPractices();

  return (
    <main className="container-page grid min-h-svh place-items-center py-24" data-theme="navy">
      <div className="w-full max-w-2xl">
        <p className="eyebrow text-accent-deep">{siteConfig.agencyName}</p>
        <h1 className="mt-4 text-4xl font-medium md:text-6xl">Website previews</h1>

        {isDev ? (
          <>
            <p className="mt-4 text-muted">
              {practices.length} practices in <code>data/practices.json</code>. This list only appears in
              development.
            </p>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {practices.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/preview/${p.slug}/`}
                    className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent-deep"
                  >
                    <span>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-muted">
                        {" "}
                        · {p.city}, {p.state}
                      </span>
                    </span>
                    <span className="text-sm text-muted">{p.theme} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-4 text-muted">Previews are shared by private link.</p>
        )}
      </div>
    </main>
  );
}
