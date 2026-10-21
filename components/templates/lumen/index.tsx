import { Header } from "@/components/shared/Header";
import { MobileBar } from "@/components/shared/MobileBar";
import type { Practice } from "@/lib/practices";
import { About } from "./About";
import { Booking } from "./Booking";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Journey } from "./Journey";
import { Location } from "./Location";
import { Offer } from "./Offer";
import { ProofStrip } from "./ProofStrip";
import { Results } from "./Results";
import { Reviews } from "./Reviews";
import { Services } from "./Services";

/** Lumen: dark and cinematic, with a real-time WebGL tooth and canvas star dust. */
export function LumenTemplate({ practice }: { practice: Practice }) {
  return (
    <>
      <Header practice={practice} variant="glass" />
      <main id="main">
        <Hero practice={practice} />
        <ProofStrip practice={practice} />
        <Services phone={practice.phone} />
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
