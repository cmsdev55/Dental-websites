import { atelierButton, EYEBROW, Ornament } from "@/components/templates/atelier/ui";
import { FooterWordmark } from "@/components/shared/FooterWordmark";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import { navLinks } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { siteConfig } from "@/lib/site";
import { cn, telHref } from "@/lib/utils";

export function Footer({ practice }: { practice: Practice }) {
  const year = new Date().getFullYear();

  return (
    <footer className="on-primary overflow-hidden bg-primary pt-24 pb-28 text-primary-ink md:pt-32 md:pb-12">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <Ornament />
          <RevealText
            as="h2"
            text="Your smile, *considered.*"
            className="mt-8 text-[clamp(2.8rem,6.5vw,5.75rem)] leading-[0.96] font-light tracking-[-0.01em]"
            accentClassName="text-[var(--gold)]"
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <MagneticButton strength={0.25}>
              <a href="#booking" className={atelierButton("solid")}>
                Book an appointment
              </a>
            </MagneticButton>
            <a href={telHref(practice.phone)} className={atelierButton("light")}>
              {practice.phone}
            </a>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-y border-[var(--line-on-primary)] py-12 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <p className={cn("text-[var(--gold)]", EYEBROW)}>The practice</p>
            <p className="mt-4 font-display text-2xl font-light">{practice.name}</p>
            <p className="mt-2 text-primary-muted">
              {practice.address && <span className="block">{practice.address}</span>}
              {practice.city}, {practice.state}
            </p>
          </div>
          <nav aria-label="Footer">
            <p className={cn("text-[var(--gold)]", EYEBROW)}>Explore</p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-primary-muted transition-colors hover:text-primary-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className={cn("text-[var(--gold)]", EYEBROW)}>Contact</p>
            <a
              href={telHref(practice.phone)}
              className="mt-4 inline-block font-display text-2xl font-light underline-offset-4 hover:underline"
            >
              {practice.phone}
            </a>
          </div>
        </div>

        <div className="mt-14 text-center">
          <FooterWordmark name={practice.name} />
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-[var(--line-on-primary)] pt-6 text-sm text-primary-muted md:flex-row md:justify-between">
          <p>
            &copy; {year} {practice.name}
          </p>
          <p>
            Website preview by{" "}
            {siteConfig.agencyUrl ? (
              <a
                href={siteConfig.agencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-ink underline-offset-4 hover:underline"
              >
                {siteConfig.agencyName}
              </a>
            ) : (
              <span className="text-primary-ink">{siteConfig.agencyName}</span>
            )}
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-primary-muted md:text-left">
          Concept preview prepared for {practice.name}. Not the practice&rsquo;s official website; photos, reviews and
          offers shown are placeholders.
        </p>
      </div>
    </footer>
  );
}
