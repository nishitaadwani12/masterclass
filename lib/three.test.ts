import { describe, it, expect } from "vitest";
import { spin } from "./three";

describe("spin", () => {
  it("advances rotation by delta * speed", () => {
    const obj = { rotation: { x: 0, y: 0 } };
    spin(obj, 2);
    expect(obj.rotation.x).toBeCloseTo(0.3);
    expect(obj.rotation.y).toBeCloseTo(0.4);
  });

  it("respects a custom speed", () => {
    const obj = { rotation: { x: 1, y: 1 } };
    spin(obj, 1, { x: 1, y: 2 });
    expect(obj.rotation.x).toBe(2);
    expect(obj.rotation.y).toBe(3);
  });

  it("is a no-op when the object is null", () => {
    expect(() => spin(null, 1)).not.toThrow();
  });
});
