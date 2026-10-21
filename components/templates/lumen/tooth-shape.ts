/**
 * The molar silhouette used by both the 3D scene and its SVG poster, so the poster and the
 * WebGL render line up exactly. Coordinates are y-up, roughly -1…1 wide and -1.5…1.1 tall.
 */
export type ToothSegment =
  | { type: "M"; x: number; y: number }
  | { type: "C"; c1: [number, number]; c2: [number, number]; to: [number, number] };

export const TOOTH_OUTLINE: ToothSegment[] = [
  { type: "M", x: -0.62, y: -1.38 },
  // Left root, outer edge, up to the crown
  { type: "C", c1: [-0.8, -0.95], c2: [-0.98, -0.45], to: [-1.0, 0.1] },
  // Crown: left cusp, central groove, right cusp
  { type: "C", c1: [-1.02, 0.7], c2: [-0.82, 1.1], to: [-0.45, 1.1] },
  { type: "C", c1: [-0.22, 1.1], c2: [-0.14, 0.92], to: [0, 0.92] },
  { type: "C", c1: [0.14, 0.92], c2: [0.22, 1.1], to: [0.45, 1.1] },
  { type: "C", c1: [0.82, 1.1], c2: [1.02, 0.7], to: [1.0, 0.1] },
  // Right root, outer edge, tip, inner edge up to the furcation
  { type: "C", c1: [0.98, -0.45], c2: [0.8, -0.95], to: [0.62, -1.38] },
  { type: "C", c1: [0.56, -1.52], c2: [0.28, -1.52], to: [0.22, -1.36] },
  { type: "C", c1: [0.16, -1.0], c2: [0.12, -0.62], to: [0, -0.6] },
  // Left root, inner edge and tip
  { type: "C", c1: [-0.12, -0.62], c2: [-0.16, -1.0], to: [-0.22, -1.36] },
  { type: "C", c1: [-0.28, -1.52], c2: [-0.56, -1.52], to: [-0.62, -1.38] },
];

/** SVG path data (y flipped for screen space), for a viewBox of "-1.3 -1.3 2.6 2.95". */
export const TOOTH_SVG_PATH = TOOTH_OUTLINE.map((s) =>
  s.type === "M"
    ? `M${s.x} ${-s.y}`
    : `C${s.c1[0]} ${-s.c1[1]} ${s.c2[0]} ${-s.c2[1]} ${s.to[0]} ${-s.to[1]}`,
).join(" ") + "Z";
