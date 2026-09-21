import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/lib/types";

const base: Course = {
  slug: "demo",
  title: "Demo Course",
  subtitle: "A demo subtitle",
  description: "d",
  audience: "engineering",
  level: "beginner",
  format: "live-cohort",
  durationWeeks: 8,
  priceInPaise: 4999900,
  outcomes: [],
  modules: [],
};

describe("CourseCard", () => {
  it("renders a discounted course with list price and discount badge", () => {
    render(<CourseCard course={{ ...base, listPriceInPaise: 7499900 }} />);
    expect(screen.getByText("Demo Course")).toBeInTheDocument();
    expect(screen.getByText("₹49,999")).toBeInTheDocument();
    expect(screen.getByText("₹74,999")).toBeInTheDocument();
    expect(screen.getByText("33% off")).toBeInTheDocument();
    expect(screen.getByText(/8 weeks/)).toBeInTheDocument();
    expect(screen.getByTestId("course-card")).toHaveAttribute("href", "/courses/demo");
  });

  it("omits list price and discount when there is no list price", () => {
    render(<CourseCard course={base} />);
    expect(screen.queryByText("₹74,999")).not.toBeInTheDocument();
    expect(screen.queryByText(/% off/)).not.toBeInTheDocument();
  });
});
