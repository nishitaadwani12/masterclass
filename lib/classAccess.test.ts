import { describe, it, expect } from "vitest";
import { getZoomUrl } from "./classAccess";
import { COURSES } from "./courses";

describe("getZoomUrl", () => {
  it("returns a Zoom link for a known course", () => {
    expect(getZoomUrl("sde-interview-mastery")).toMatch(/^https:\/\/zoom\.us\//);
  });

  it("returns undefined for an unknown course", () => {
    expect(getZoomUrl("does-not-exist")).toBeUndefined();
  });

  it("configures a Zoom link for every course in the catalogue", () => {
    for (const course of COURSES) {
      expect(getZoomUrl(course.slug)).toBeTruthy();
    }
  });
});
