/** Minimal shape of a three.js object we rotate (avoids depending on three's
 * types in this pure, WebGL-free helper). */
export interface Spinnable {
  rotation: { x: number; y: number };
}

/**
 * Advances an object's rotation by `delta` seconds. No-op when the object has
 * not mounted yet (ref is null). Pure, so it is tested without a GL context.
 */
export function applyRotation(
  obj: Spinnable | null,
  delta: number,
  speed: { x: number; y: number } = { x: 0.08, y: 0.16 },
): void {
  if (!obj) {
    return;
  }
  obj.rotation.x += delta * speed.x;
  obj.rotation.y += delta * speed.y;
}
