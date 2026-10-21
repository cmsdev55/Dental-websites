import { Header } from "@/components/shared/Header";
import { MobileBar } from "@/components/shared/MobileBar";
import { MarqueeBand } from "@/components/templates/studio/MarqueeBand";
import { ReviewStack } from "@/components/templates/studio/ReviewStack";
import { ServicesRing } from "@/components/templates/studio/ServicesRing";
import { StudioAbout } from "@/components/templates/studio/StudioAbout";
import { StudioBooking } from "@/components/templates/studio/StudioBooking";
import { StudioFooter } from "@/components/templates/studio/StudioFooter";
import { StudioHero } from "@/components/templates/studio/StudioHero";
import { StudioLocation } from "@/components/templates/studio/StudioLocation";
import { StudioOffer } from "@/components/templates/studio/StudioOffer";
import { StudioResults } from "@/components/templates/studio/StudioResults";
import { VisitStack } from "@/components/templates/studio/VisitStack";
import type { Practice } from "@/lib/practices";

/**
 * Studio: bright, playful and bold. Signature pieces are the interactive bubble canvas,
 * the 3D services ring, sticky stacking visit cards and a swipeable review deck.
 */
export function StudioTemplate({ practice }: { practice: Practice }) {
  return (
    <>
      <Header practice={practice} variant="pill" />
      <main id="main">
        <StudioHero practice={practice} />
        <MarqueeBand />
        <ServicesRing />
        <VisitStack />
        <StudioResults practiceName={practice.name} />
        <StudioAbout practice={practice} />
        <ReviewStack practice={practice} />
        <StudioOffer practice={practice} />
        <StudioBooking practice={practice} />
        <StudioLocation practice={practice} />
      </main>
      <StudioFooter practice={practice} />
      <MobileBar phone={practice.phone} />
    </>
  );
}
