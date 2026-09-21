/**
 * Pure math for the hero's particle wave field. Kept framework-free so it can
 * be unit-tested without a WebGL context (the React component is a thin shell).
 */

export interface PositionAttribute {
  // Loose enough to accept both three's TypedArray and a plain Float32Array.
  array: { [index: number]: number; length: number };
  needsUpdate: boolean;
}

export interface PointsLike {
  // Index signature mirrors three's NormalBufferAttributes.
  geometry: { attributes: { [name: string]: PositionAttribute } };
}

const WAVE_FREQUENCY = 0.9;
const WAVE_SPEED = 1.4;
const WAVE_AMPLITUDE = 0.55;

const VIOLET: [number, number, number] = [0.486, 0.361, 1]; // #7c5cff
const GOLD: [number, number, number] = [0.914, 0.769, 0.416]; // #e9c46a

/** Radius used to normalise a point's distance from the grid centre to [0, 1). */
function gridRadius(dim: number, separation: number): number {
  return (dim / 2) * separation * Math.SQRT2;
}

/** Builds a flat (y = 0) square grid of points centred on the origin. */
export function buildGrid(dim: number, separation: number): Float32Array {
  const positions = new Float32Array(dim * dim * 3);
  let i = 0;
  for (let xi = 0; xi < dim; xi++) {
    for (let zi = 0; zi < dim; zi++) {
      positions[i++] = (xi - dim / 2) * separation;
      positions[i++] = 0;
      positions[i++] = (zi - dim / 2) * separation;
    }
  }
  return positions;
}

/** Per-vertex colours: a radial violet→gold gradient from the centre outward. */
export function buildGridColors(dim: number, separation: number): Float32Array {
  const colors = new Float32Array(dim * dim * 3);
  const maxD = gridRadius(dim, separation);
  let i = 0;
  for (let xi = 0; xi < dim; xi++) {
    for (let zi = 0; zi < dim; zi++) {
      const x = (xi - dim / 2) * separation;
      const z = (zi - dim / 2) * separation;
      const t = Math.sqrt(x * x + z * z) / maxD;
      colors[i++] = VIOLET[0] + (GOLD[0] - VIOLET[0]) * t;
      colors[i++] = VIOLET[1] + (GOLD[1] - VIOLET[1]) * t;
      colors[i++] = VIOLET[2] + (GOLD[2] - VIOLET[2]) * t;
    }
  }
  return colors;
}

/** Vertical displacement of a point at (x, z) at a given time. */
export function waveHeight(x: number, z: number, time: number): number {
  const d = Math.sqrt(x * x + z * z);
  return Math.sin(d * WAVE_FREQUENCY - time * WAVE_SPEED) * WAVE_AMPLITUDE;
}

/**
 * Animates the wave by rewriting the y-component of every point. No-op when the
 * points object has not mounted yet (ref is null).
 */
export function updateWaveField(points: PointsLike | null, time: number): void {
  if (!points) {
    return;
  }
  const arr = points.geometry.attributes.position.array;
  for (let i = 0; i < arr.length; i += 3) {
    arr[i + 1] = waveHeight(arr[i], arr[i + 2], time);
  }
  points.geometry.attributes.position.needsUpdate = true;
}
