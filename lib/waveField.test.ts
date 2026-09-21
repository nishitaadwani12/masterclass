import { describe, it, expect } from "vitest";
import {
  buildGrid,
  buildGridColors,
  waveHeight,
  updateWaveField,
  type PointsLike,
} from "./waveField";

describe("buildGrid", () => {
  it("creates dim*dim points with y = 0 and centred coordinates", () => {
    const dim = 4;
    const sep = 0.5;
    const grid = buildGrid(dim, sep);
    expect(grid).toHaveLength(dim * dim * 3);
    // Every y-component starts flat.
    for (let i = 1; i < grid.length; i += 3) {
      expect(grid[i]).toBe(0);
    }
    // First point is the far corner.
    expect(grid[0]).toBeCloseTo((0 - dim / 2) * sep);
    expect(grid[2]).toBeCloseTo((0 - dim / 2) * sep);
  });
});

describe("buildGridColors", () => {
  it("returns rgb triples in [0,1] with violet at the centre", () => {
    const dim = 4;
    const colors = buildGridColors(dim, 0.5);
    expect(colors).toHaveLength(dim * dim * 3);
    expect(Math.min(...colors)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...colors)).toBeLessThanOrEqual(1);
  });

  it("blends toward gold as points move away from the centre", () => {
    // Centre-ish point has more blue (violet); a corner has less blue (gold).
    const colors = buildGridColors(4, 0.5);
    const blueChannel = (idx: number) => colors[idx * 3 + 2];
    // Point index 0 is a corner (far), index 10 is near the centre for dim=4.
    expect(blueChannel(10)).toBeGreaterThan(blueChannel(0));
  });
});

describe("waveHeight", () => {
  it("stays within the amplitude bounds", () => {
    for (const [x, z, t] of [
      [0, 0, 0],
      [1, 1, 0.5],
      [3, -2, 2],
    ]) {
      expect(Math.abs(waveHeight(x, z, t))).toBeLessThanOrEqual(0.55 + 1e-9);
    }
  });

  it("changes over time at a fixed point", () => {
    expect(waveHeight(1, 1, 0)).not.toBeCloseTo(waveHeight(1, 1, 1));
  });
});

describe("updateWaveField", () => {
  it("is a no-op when points is null", () => {
    expect(() => updateWaveField(null, 1)).not.toThrow();
  });

  it("rewrites y-values and flags the attribute for upload", () => {
    const array = new Float32Array([1, 0, 0, 2, 0, 0]);
    const points: PointsLike = {
      geometry: { attributes: { position: { array, needsUpdate: false } } },
    };
    updateWaveField(points, 0.5);
    expect(array[1]).toBeCloseTo(waveHeight(1, 0, 0.5));
    expect(array[4]).toBeCloseTo(waveHeight(2, 0, 0.5));
    expect(points.geometry.attributes.position.needsUpdate).toBe(true);
  });
});
