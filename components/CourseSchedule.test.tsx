import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CourseSchedule } from "./CourseSchedule";
import type { CourseSession } from "@/lib/types";

const sessions: CourseSession[] = [
  { title: "Kickoff call", startsAt: "2026-10-06T13:30:00.000Z", durationMinutes: 90 },
];

describe("CourseSchedule", () => {
  it("shows the Zoom join link when enrolled and a link is provided", () => {
    render(
      <CourseSchedule
        sessions={sessions}
        classDetails="Twice a week on Zoom."
        enrolled
        zoomUrl="https://zoom.us/j/123"
      />,
    );
    expect(screen.getByText("Enrolled")).toBeInTheDocument();
    expect(screen.getByText("Twice a week on Zoom.")).toBeInTheDocument();
    expect(screen.getByText("Kickoff call")).toBeInTheDocument();
    expect(screen.getByText(/90 min/)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Join live class on Zoom/ });
    expect(link).toHaveAttribute("href", "https://zoom.us/j/123");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("locks the Zoom link for a visitor who is not enrolled", () => {
    render(<CourseSchedule sessions={sessions} enrolled={false} />);
    expect(screen.queryByText("Enrolled")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Zoom/ })).not.toBeInTheDocument();
    expect(screen.getByText(/Enroll to unlock the Zoom link/)).toBeInTheDocument();
  });

  it("stays locked if enrolled but no Zoom link is configured", () => {
    render(<CourseSchedule sessions={sessions} enrolled zoomUrl={undefined} />);
    expect(screen.getByText("Enrolled")).toBeInTheDocument();
    expect(screen.getByText(/Enroll to unlock the Zoom link/)).toBeInTheDocument();
  });

  it("omits class details when none are given and shows an empty schedule note", () => {
    render(<CourseSchedule sessions={[]} enrolled={false} />);
    expect(screen.getByText(/schedule will be announced soon/i)).toBeInTheDocument();
  });
});
