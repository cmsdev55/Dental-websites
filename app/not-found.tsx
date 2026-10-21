import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page grid min-h-svh place-items-center py-24 text-center" data-theme="navy">
      <div>
        <p className="eyebrow text-accent-deep">404</p>
        <h1 className="mt-4 text-4xl font-medium md:text-6xl">This preview isn&rsquo;t here</h1>
        <p className="mt-4 text-muted">The link may have a typo, or the preview has been retired.</p>
        <Link href="/" className="mt-8 inline-block underline underline-offset-4">
          Back home
        </Link>
      </div>
    </main>
  );
}
