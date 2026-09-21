import { describe, it, expect } from "vitest";
import {
  COURSES,
  getAllCourses,
  getFeaturedCourses,
  getCourseBySlug,
  getCoursesByAudience,
} from "./courses";

describe("courses", () => {
  it("exposes a non-empty catalogue with unique slugs", () => {
    expect(getAllCourses().length).toBeGreaterThan(0);
    const slugs = COURSES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("returns only featured courses", () => {
    const featured = getFeaturedCourses();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((c) => c.featured)).toBe(true);
  });

  it("finds a course by slug", () => {
    const course = getCourseBySlug("sde-interview-mastery");
    expect(course?.title).toBe("SDE Interview Mastery");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCourseBySlug("does-not-exist")).toBeUndefined();
  });

  it("filters engineering courses (including 'both')", () => {
    const eng = getCoursesByAudience("engineering");
    expect(eng.every((c) => c.audience === "engineering" || c.audience === "both")).toBe(true);
    expect(eng.some((c) => c.audience === "engineering")).toBe(true);
  });

  it("filters mba courses (including 'both')", () => {
    const mba = getCoursesByAudience("mba");
    expect(mba.every((c) => c.audience === "mba" || c.audience === "both")).toBe(true);
  });

  it("returns all courses for the 'both' audience", () => {
    expect(getCoursesByAudience("both")).toHaveLength(COURSES.length);
  });

  it("prices every course within the student-friendly ₹250–₹500 range", () => {
    for (const course of COURSES) {
      expect(course.priceInPaise).toBeGreaterThanOrEqual(25000);
      expect(course.priceInPaise).toBeLessThanOrEqual(50000);
    }
  });
});
