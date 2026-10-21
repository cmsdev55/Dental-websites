/**
 * Real-time 3D tooth for the Lumen hero (three.js).
 * Only ever loaded with `await import()` from ToothStage, so three.js stays out of the initial bundle.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Scene,
  Shape,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { TOOTH_OUTLINE } from "./tooth-shape";

export interface ToothScene {
  /** Pointer position, -1…1 on each axis (0,0 = center of the viewport). */
  setPointer(x: number, y: number): void;
  /** 0 at the top of the hero, 1 once it has scrolled out of view. */
  setProgress(progress: number): void;
  /** Start/stop the render loop (off-screen, hidden tab). */
  setActive(active: boolean): void;
  dispose(): void;
}

interface Options {
  /** Render one still frame and never loop. */
  still: boolean;
  /** Called after the first frame is on screen, to crossfade from the poster. */
  onFirstFrame: () => void;
}

const AQUA = new Color("#7ce3f7");
const VIOLET = new Color("#8f7cff");

function toothGeometry(): BufferGeometry {
  const shape = new Shape();
  for (const s of TOOTH_OUTLINE) {
    if (s.type === "M") shape.moveTo(s.x, s.y);
    else shape.bezierCurveTo(s.c1[0], s.c1[1], s.c2[0], s.c2[1], s.to[0], s.to[1]);
  }

  const bevelSize = 0.13;
  let geometry: BufferGeometry = new ExtrudeGeometry(shape, {
    depth: 0.42,
    curveSegments: 64,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize,
    // Inset the faces by the bevel so the outline keeps its silhouette while the edges pillow out.
    bevelOffset: -bevelSize,
    bevelSegments: 18,
  });
  geometry.center();

  // Weld the cap and bevel seams, then rebuild smooth normals for a soft, moulded look.
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("uv");
  geometry = mergeVertices(geometry, 1e-4);
  geometry.computeVertexNormals();
  return geometry;
}

/** A soft round sprite for the orbiting particles. */
function glowTexture(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.65)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function orbitParticles(texture: CanvasTexture): Points {
  const count = 220;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 0.65;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.45;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    const c = AQUA.clone().lerp(VIOLET, Math.random()).lerp(new Color("#ffffff"), Math.random() * 0.35);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  const material = new PointsMaterial({
    size: 0.07,
    map: texture,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  });
  return new Points(geometry, material);
}

function orbitRing(radius: number, color: Color, opacity: number): Mesh {
  return new Mesh(
    new TorusGeometry(radius, 0.0045, 8, 320),
    new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false }),
  );
}

export function createToothScene(canvas: HTMLCanvasElement, { still, onFirstFrame }: Options): ToothScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;

  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.1, 8.6);

  // Lighting: soft key, aqua rim from the left, violet kicker from behind-right.
  scene.add(new AmbientLight(0xffffff, 0.08));
  const key = new DirectionalLight(0xffffff, 0.7);
  key.position.set(3, 5, 5);
  const rim = new DirectionalLight(AQUA, 4.5);
  rim.position.set(-6, 2, -1.5);
  const kicker = new DirectionalLight(VIOLET, 4);
  kicker.position.set(6, -1.5, -2);
  scene.add(key, rim, kicker);

  const enamel = new MeshPhysicalMaterial({
    color: new Color("#e6edf5"),
    roughness: 0.26,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    iridescence: 0.4,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [140, 420],
    sheen: 0.6,
    sheenColor: AQUA,
    sheenRoughness: 0.45,
    envMapIntensity: 0.75,
  });

  const tooth = new Mesh(toothGeometry(), enamel);
  const sprite = glowTexture();
  const particles = orbitParticles(sprite);
  const ringA = orbitRing(1.72, AQUA, 0.55);
  const ringB = orbitRing(2.02, VIOLET, 0.35);
  ringA.rotation.set(Math.PI / 2 - 0.32, 0.18, 0);
  ringB.rotation.set(Math.PI / 2 + 0.22, -0.3, 0);

  const orbit = new Group();
  orbit.add(particles, ringA, ringB);
  orbit.rotation.z = -0.18;

  const rig = new Group();
  rig.add(tooth, orbit);
  scene.add(rig);

  // Smoothed inputs
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let progress = 0;
  let targetProgress = 0;

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const { width, height } = parent.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.25 : 1.75);
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the tooth fully in frame on tall, narrow stages.
    camera.position.z = camera.aspect < 0.9 ? (8.6 * 0.9) / Math.max(camera.aspect, 0.55) : 8.6;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (still || !running) render(elapsed);
  });
  if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
  resize();

  let elapsed = 0;
  let last = 0;
  let frame = 0;
  let running = false;
  let firstFrame = true;

  function render(t: number) {
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    progress += (targetProgress - progress) * 0.08;

    // A bounded sway (never edge-on) keeps the molar silhouette readable; scroll turns it further.
    const sway = still ? -0.35 : Math.sin(t * 0.45) * 0.55;
    tooth.rotation.y = sway + pointer.x * 0.4 + progress * Math.PI * 0.6;
    tooth.rotation.x = 0.14 + pointer.y * 0.22 + progress * 0.3;
    tooth.rotation.z = Math.sin(t * 0.5) * 0.04;
    rig.position.y = (still ? 0 : Math.sin(t * 0.9) * 0.09) - progress * 0.5;
    rig.scale.setScalar(1 - progress * 0.18);
    orbit.rotation.y = t * 0.12;
    particles.rotation.y = t * 0.05;

    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      onFirstFrame();
    }
  }

  const loop = () => {
    // Accumulate our own time so pausing (off-screen) resumes smoothly instead of jumping.
    const now = performance.now();
    elapsed += Math.min((now - last) / 1000, 0.05);
    last = now;
    render(elapsed);
    frame = requestAnimationFrame(loop);
  };

  if (still) render(0);

  return {
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
    },
    setProgress(p) {
      targetProgress = Math.min(1, Math.max(0, p));
      if (still) {
        progress = targetProgress;
        render(0);
      }
    },
    setActive(active) {
      if (still || active === running) return;
      running = active;
      if (active) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(frame);
      }
    },
    dispose() {
      cancelAnimationFrame(frame);
      running = false;
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof Mesh || object instanceof Points) {
          object.geometry.dispose();
          const material = object.material;
          (Array.isArray(material) ? material : [material]).forEach((m) => m.dispose());
        }
      });
      sprite.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
