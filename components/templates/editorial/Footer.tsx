import { Phone } from "lucide-react";
import { FooterWordmark } from "@/components/shared/FooterWordmark";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import { navLinks } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { siteConfig } from "@/lib/site";
import { telHref } from "@/lib/utils";

export function Footer({ practice }: { practice: Practice }) {
  const year = new Date().getFullYear();

  return (
    <footer className="on-primary overflow-hidden bg-primary pt-20 pb-28 text-primary-ink md:pt-28 md:pb-10">
      <div className="container-page">
        <div className="flex flex-col gap-10 border-b border-[var(--line-on-primary)] pb-16 md:flex-row md:items-end md:justify-between">
          <RevealText
            as="h2"
            text="Ready when *you are.*"
            className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[1] font-light"
            accentClassName="text-accent"
          />
          <div className="flex flex-wrap gap-3">
            <MagneticButton>
              <a href="#booking" className={buttonClasses("accent", "min-h-14 px-7 text-base")}>
                Book your visit <ButtonArrow />
              </a>
            </MagneticButton>
            <a href={telHref(practice.phone)} className={buttonClasses("outline-light", "min-h-14 px-6 text-base")}>
              <Phone aria-hidden="true" className="size-4" /> {practice.phone}
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl">{practice.name}</p>
            <p className="mt-3 max-w-sm text-primary-muted">
              Modern, gentle dentistry in {practice.city}, {practice.state}.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow text-primary-muted">Explore</p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow text-primary-muted">Contact</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={telHref(practice.phone)} className="transition-colors hover:text-accent">
                  {practice.phone}
                </a>
              </li>
              {practice.address && <li className="text-primary-muted">{practice.address}</li>}
              <li className="text-primary-muted">
                {practice.city}, {practice.state}
              </li>
            </ul>
          </div>
        </div>

        <FooterWordmark name={practice.name} />

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--line-on-primary)] pt-6 text-sm text-primary-muted md:flex-row md:items-center md:justify-between">
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
        <p className="mt-4 text-xs text-primary-muted">
          Concept preview prepared for {practice.name}. Not the practice&rsquo;s official website; photos, reviews and
          offers shown are placeholders.
        </p>
      </div>
    </footer>
  );
}
