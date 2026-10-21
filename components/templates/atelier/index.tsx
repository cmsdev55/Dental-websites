import { About } from "@/components/templates/atelier/About";
import { Booking } from "@/components/templates/atelier/Booking";
import { Footer } from "@/components/templates/atelier/Footer";
import { Hero } from "@/components/templates/atelier/Hero";
import { Journey } from "@/components/templates/atelier/Journey";
import { Location } from "@/components/templates/atelier/Location";
import { Offer } from "@/components/templates/atelier/Offer";
import { Results } from "@/components/templates/atelier/Results";
import { Reviews } from "@/components/templates/atelier/Reviews";
import { Services } from "@/components/templates/atelier/Services";
import { Statement } from "@/components/templates/atelier/Statement";
import { Header } from "@/components/shared/Header";
import { MobileBar } from "@/components/shared/MobileBar";
import type { Practice } from "@/lib/practices";

/**
 * Atelier: warm, quiet luxury for boutique and cosmetic practices.
 * Cormorant serif, arches and gold hairlines, flowing canvas silk and a horizontal journey.
 */
export function AtelierTemplate({ practice }: { practice: Practice }) {
  return (
    <>
      <Header practice={practice} variant="center" />
      <main id="main">
        <Hero practice={practice} />
        <Statement />
        <Services />
        <Journey />
        <Results practiceName={practice.name} />
        <About practice={practice} />
        <Reviews practice={practice} />
        <Offer practice={practice} />
        <Booking practice={practice} />
        <Location practice={practice} />
      </main>
      <Footer practice={practice} />
      <MobileBar phone={practice.phone} />
    </>
  );
}
