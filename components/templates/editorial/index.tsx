import { Footer } from "@/components/templates/editorial/Footer";
import { About } from "@/components/templates/editorial/About";
import { BeforeAfter } from "@/components/templates/editorial/BeforeAfter";
import { Booking } from "@/components/templates/editorial/Booking";
import { Hero } from "@/components/templates/editorial/Hero";
import { Location } from "@/components/templates/editorial/Location";
import { Marquee } from "@/components/templates/editorial/Marquee";
import { OfferBanner } from "@/components/templates/editorial/OfferBanner";
import { Reviews } from "@/components/templates/editorial/Reviews";
import { Services } from "@/components/templates/editorial/Services";
import { TrustBar } from "@/components/templates/editorial/TrustBar";
import { VisitSteps } from "@/components/templates/editorial/VisitSteps";
import { Header } from "@/components/shared/Header";
import { MobileBar } from "@/components/shared/MobileBar";
import { marqueeItems } from "@/lib/content";
import type { Practice } from "@/lib/practices";

/** Editorial: refined serif, light and photographic. Recolored by the practice's `theme`. */
export function EditorialTemplate({ practice }: { practice: Practice }) {
  return (
    <>
      <Header practice={practice} variant="bar" />
      <main id="main">
        <Hero practice={practice} />
        <TrustBar practice={practice} />
        <Services />
        <VisitSteps />
        <BeforeAfter practiceName={practice.name} />
        <Marquee items={marqueeItems} />
        <About practice={practice} />
        <Reviews practice={practice} />
        <OfferBanner practice={practice} />
        <Booking practice={practice} />
        <Location practice={practice} />
      </main>
      <Footer practice={practice} />
      <MobileBar phone={practice.phone} />
    </>
  );
}
