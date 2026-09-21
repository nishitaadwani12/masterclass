import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveClassCard } from "./LiveClassCard";
import type { LiveClass } from "@/lib/types";

const base: LiveClass = {
  id: "lc-1",
  title: "Live Session",
  mentor: "Aarti Sharma",
  audience: "both",
  startsAt: "2026-10-05T13:30:00.000Z",
  durationMinutes: 90,
  seatsTotal: 100,
  seatsTaken: 40,
};

describe("LiveClassCard", () => {
  it("shows remaining seats when plenty are available", () => {
    render(<LiveClassCard liveClass={base} />);
    expect(screen.getByText("Live Session")).toBeInTheDocument();
    expect(screen.getByText("Aarti Sharma")).toBeInTheDocument();
    expect(screen.getByText("60 seats left")).toBeInTheDocument();
    expect(screen.getByText("90 min")).toBeInTheDocument();
  });

  it("shows a filling-fast badge when few seats remain", () => {
    render(<LiveClassCard liveClass={{ ...base, seatsTaken: 90 }} />);
    expect(screen.getByText("Filling fast")).toBeInTheDocument();
  });

  it("shows a sold-out badge when full", () => {
    render(<LiveClassCard liveClass={{ ...base, seatsTaken: 100 }} />);
    expect(screen.getByText("Sold out")).toBeInTheDocument();
  });
});
