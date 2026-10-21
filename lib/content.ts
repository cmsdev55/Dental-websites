/**
 * Shared copy for every preview. Everything here is deliberately generic:
 * no awards, years, insurance lists, staff names or real testimonials.
 */

export const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#visit", label: "Your visit" },
  { href: "#about", label: "About" },
  { href: "#reviews", label: "Reviews" },
  { href: "#location", label: "Location" },
] as const;

export type ServiceIcon = "cleaning" | "whitening" | "aligners" | "implants" | "veneers" | "emergency";

export const services: { icon: ServiceIcon; title: string; body: string }[] = [
  {
    icon: "cleaning",
    title: "Checkups & cleanings",
    body: "Thorough, gentle cleanings and exams that keep small issues from becoming big ones.",
  },
  {
    icon: "whitening",
    title: "Teeth whitening",
    body: "Professional whitening that brightens your smile safely, with results you can see.",
  },
  {
    icon: "aligners",
    title: "Clear aligners",
    body: "Straighten your teeth discreetly with custom aligners designed around your goals.",
  },
  {
    icon: "implants",
    title: "Dental implants",
    body: "Natural-looking, long-lasting replacements for missing teeth that feel like your own.",
  },
  {
    icon: "veneers",
    title: "Veneers & cosmetic",
    body: "Subtle refinements or a full smile makeover, planned with you from the first sketch.",
  },
  {
    icon: "emergency",
    title: "Emergency care",
    body: "Toothache or chipped tooth? Call us and we'll help you get comfortable fast.",
  },
];

export const visitSteps = [
  {
    title: "Book online",
    body: "Pick a service and a time that suits you in a few taps, or simply give us a call.",
  },
  {
    title: "Comfortable check-in",
    body: "A calm, welcoming space. We'll listen to your history and goals before anything else.",
  },
  {
    title: "Gentle treatment",
    body: "We explain each step before we begin, check in often and move at your pace.",
  },
  {
    title: "Bright smile",
    body: "Leave with a clear plan for what's next, and a smile you'll want to share.",
  },
] as const;

export const marqueeItems = [
  "Invisalign",
  "Dental Implants",
  "Teeth Whitening",
  "Porcelain Veneers",
  "Emergency Care",
  "Crowns & Bridges",
  "Family Dentistry",
  "Gentle Cleanings",
  "Root Canal Therapy",
  "Smile Makeovers",
];

/** Sample reviews only. They are always shown with "Patient name" and a "Sample" label. */
export const sampleReviews = [
  "Everyone made me feel at ease from the moment I walked in. Every step was explained before it happened, and I never felt rushed.",
  "I'd put off the dentist for years. This visit was calm, honest and surprisingly easy. I've already booked my next cleaning.",
  "Booking took a minute, the office was spotless, and I left with a clear plan and no pressure. Exactly what I was looking for.",
  "Gentle, patient and genuinely kind with my kids. They actually look forward to their checkups now.",
  "My smile looks natural and bright. I finally feel confident in photos again.",
];

export const bookingServices = [
  "Checkup & cleaning",
  "Teeth whitening",
  "Clear aligners consult",
  "Implant consult",
  "Cosmetic consult",
  "Tooth pain / emergency",
] as const;

export const timeWindows = ["Morning", "Afternoon", "First available"] as const;

/** Displayed only when a practice has no real hours, always labeled "Sample hours". */
export const sampleHours = [
  { days: "Monday – Thursday", time: "8:00 AM – 5:00 PM" },
  { days: "Friday", time: "8:00 AM – 2:00 PM" },
  { days: "Saturday – Sunday", time: "Closed" },
];
