import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children with the default muted tone", () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText("Default");
    expect(el.className).toContain("text-text-muted");
  });

  it.each([
    ["violet", "text-violet-bright"],
    ["gold", "text-gold-bright"],
    ["danger", "text-red-300"],
  ] as const)("renders the %s tone", (tone, expected) => {
    render(<Badge tone={tone}>{tone}</Badge>);
    expect(screen.getByText(tone).className).toContain(expected);
  });
});
