/** Stock photography from Unsplash (free to use under the Unsplash License). */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const images = {
  hero: {
    src: unsplash("1629909613654-28e377c37b09"),
    alt: "Bright, modern dental treatment room with a patient chair",
  },
  steps: [
    {
      src: unsplash("1576091160550-2173dba999ef"),
      alt: "Hands typing on a laptop to book an appointment",
    },
    {
      src: unsplash("1556742049-0cfed4f6a45d"),
      alt: "Friendly front desk welcoming a patient",
    },
    {
      src: unsplash("1606811841689-23dfddce3e95"),
      alt: "Dentist explaining an x-ray to a relaxed patient in the chair",
    },
    {
      src: unsplash("1580489944761-15a19d654956"),
      alt: "Woman with a bright, confident smile",
    },
  ],
  smile: {
    src: unsplash("1607990283143-e81e7a2c9349"),
    alt: "Placeholder photo of a smiling person used to demonstrate the comparison slider",
  },
  doctor: {
    src: unsplash("1606265752439-1f18756aa5fc"),
    alt: "Placeholder stock photo of a dentist holding dental instruments",
  },
} as const;
