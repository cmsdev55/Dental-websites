import { Phone } from "lucide-react";
import { FooterWordmark } from "@/components/shared/FooterWordmark";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import { navLinks } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { siteConfig } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { GlowButton } from "./GlowButton";

export function Footer({ practice }: { practice: Practice }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-20 pb-28 md:pt-28 md:pb-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-30%] left-1/2 -z-10 h-[40rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(143_124_255/0.16),transparent)]"
      />
      <div className="container-page">
        <div className="flex flex-col gap-10 pb-16 md:flex-row md:items-end md:justify-between">
          <RevealText
            text="Ready when *you are.*"
            className="font-display text-[clamp(2.5rem,6vw,5.25rem)] leading-[1] font-light tracking-[-0.04em]"
            accentClassName="lumen-gradient-text"
          />
          <div className="flex flex-wrap gap-3">
            <MagneticButton>
              <GlowButton href="#booking">
                Book your visit <ButtonArrow />
              </GlowButton>
            </MagneticButton>
            <a href={telHref(practice.phone)} className={buttonClasses("outline", "min-h-14 px-6 text-base")}>
              <Phone aria-hidden="true" className="size-4" /> {practice.phone}
            </a>
          </div>
        </div>

        <div className="grid gap-10 border-t border-line py-14 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-xl font-semibold tracking-tight">{practice.name}</p>
            <p className="mt-3 max-w-sm text-muted">
              Modern, gentle dentistry in {practice.city}, {practice.state}.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow text-muted">Explore</p>
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
            <p className="eyebrow text-muted">Contact</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={telHref(practice.phone)} className="transition-colors hover:text-accent">
                  {practice.phone}
                </a>
              </li>
              {practice.address && <li className="text-muted">{practice.address}</li>}
              <li className="text-muted">
                {practice.city}, {practice.state}
              </li>
            </ul>
          </div>
        </div>

        <div className="lumen-wordmark">
          <FooterWordmark name={practice.name} />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
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
                className="text-ink underline-offset-4 hover:underline"
              >
                {siteConfig.agencyName}
              </a>
            ) : (
              <span className="text-ink">{siteConfig.agencyName}</span>
            )}
          </p>
        </div>
        <p className="mt-4 text-xs text-muted">
          Concept preview prepared for {practice.name}. Not the practice&rsquo;s official website; photos, reviews and
          offers shown are placeholders.
        </p>
      </div>
    </footer>
  );
}
