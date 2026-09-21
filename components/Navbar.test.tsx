import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders brand and primary links", () => {
    render(<Navbar />);
    expect(screen.getAllByText("Masterclass").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Courses" }).length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu open and closed", async () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu when a link is tapped", async () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    await userEvent.click(toggle);
    // The mobile "Live Classes" link is the last one rendered.
    const links = screen.getAllByRole("link", { name: "Live Classes" });
    await userEvent.click(links[links.length - 1]);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
