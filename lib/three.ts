/** Minimal shape of a three.js object we rotate — kept local to avoid a hard
 * dependency on three's types in this pure helper. */
export interface Rotatable {
  rotation: { x: number; y: number };
}

/**
 * Advances an object's rotation by `delta` seconds. No-op when the object is
 * not yet mounted (ref is null). Pure and framework-free so it can be tested
 * without a WebGL context.
 */
export function spin(
  obj: Rotatable | null,
  delta: number,
  speed: { x: number; y: number } = { x: 0.15, y: 0.2 },
): void {
  if (!obj) {
    return;
  }
  obj.rotation.x += delta * speed.x;
  obj.rotation.y += delta * speed.y;
}
