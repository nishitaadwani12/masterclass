import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

// jsdom has no WebGL context; stub the R3F reconciler so component bodies run.
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: ReactNode }) => (
    <div data-testid="hero-canvas">{children}</div>
  ),
  useFrame: (cb: (state: unknown, delta: number) => void) => cb({}, 0.016),
}));

import { Hero3D, HeroScene } from "./Hero3D";

describe("Hero3D", () => {
  it("renders a canvas wrapper", () => {
    render(<Hero3D />);
    expect(screen.getByTestId("hero-canvas")).toBeInTheDocument();
  });

  it("renders the wireframe globe without a WebGL context", () => {
    // Exercises the useFrame callback (ref is null during render -> no-op).
    expect(() => render(<HeroScene />)).not.toThrow();
  });
});
