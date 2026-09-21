import { describe, it, expect } from "vitest";
import { applyRotation } from "./rotation";

describe("applyRotation", () => {
  it("advances rotation by delta * default speed", () => {
    const obj = { rotation: { x: 0, y: 0 } };
    applyRotation(obj, 2);
    expect(obj.rotation.x).toBeCloseTo(0.16);
    expect(obj.rotation.y).toBeCloseTo(0.32);
  });

  it("respects a custom speed", () => {
    const obj = { rotation: { x: 1, y: 1 } };
    applyRotation(obj, 1, { x: 1, y: 2 });
    expect(obj.rotation.x).toBe(2);
    expect(obj.rotation.y).toBe(3);
  });

  it("is a no-op when the object is null", () => {
    expect(() => applyRotation(null, 1)).not.toThrow();
  });
});
