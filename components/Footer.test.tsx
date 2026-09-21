import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders column titles and links", () => {
    render(<Footer />);
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All courses" })).toHaveAttribute(
      "href",
      "/courses",
    );
  });

  it("shows the current year in the copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
