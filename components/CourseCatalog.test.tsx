import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CourseCatalog, filterCourses } from "./CourseCatalog";
import type { Course } from "@/lib/types";

function course(slug: string, audience: Course["audience"]): Course {
  return {
    slug,
    title: slug,
    subtitle: "s",
    description: "d",
    audience,
    level: "beginner",
    format: "live-cohort",
    durationWeeks: 4,
    priceInPaise: 1000,
    outcomes: [],
    modules: [],
  };
}

const courses = [
  course("mba-only", "mba"),
  course("eng-only", "engineering"),
  course("shared", "both"),
];

describe("filterCourses", () => {
  it("returns all for 'both'", () => {
    expect(filterCourses(courses, "both")).toHaveLength(3);
  });
  it("returns mba + both for 'mba'", () => {
    expect(filterCourses(courses, "mba").map((c) => c.slug)).toEqual([
      "mba-only",
      "shared",
    ]);
  });
  it("returns engineering + both for 'engineering'", () => {
    expect(filterCourses(courses, "engineering").map((c) => c.slug)).toEqual([
      "eng-only",
      "shared",
    ]);
  });
});

describe("CourseCatalog", () => {
  it("filters when a tab is selected", async () => {
    render(<CourseCatalog courses={courses} />);
    expect(screen.getAllByTestId("course-card")).toHaveLength(3);

    await userEvent.click(screen.getByRole("tab", { name: "MBA" }));
    expect(screen.getAllByTestId("course-card")).toHaveLength(2);

    await userEvent.click(screen.getByRole("tab", { name: "Engineering" }));
    const links = screen.getAllByTestId("course-card");
    expect(links).toHaveLength(2);
  });

  it("shows an empty state when nothing matches", async () => {
    render(<CourseCatalog courses={[course("mba-only", "mba")]} />);
    await userEvent.click(screen.getByRole("tab", { name: "Engineering" }));
    expect(screen.getByText(/No courses for this track/)).toBeInTheDocument();
  });
});
