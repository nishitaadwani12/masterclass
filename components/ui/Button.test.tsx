import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, ButtonLink, buttonClasses } from "./Button";

describe("buttonClasses", () => {
  it("uses primary/md defaults", () => {
    const cls = buttonClasses();
    expect(cls).toContain("rounded-full");
  });

  it("applies variant, size and extra classes", () => {
    const cls = buttonClasses("secondary", "lg", "extra");
    expect(cls).toContain("bg-gold");
    expect(cls).toContain("px-8");
    expect(cls).toContain("extra");
  });

  it("supports the ghost variant", () => {
    expect(buttonClasses("ghost", "sm")).toContain("border-line");
  });
});

describe("Button", () => {
  it("renders children and handles clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("can be disabled", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("ButtonLink", () => {
  it("renders an anchor to the href", () => {
    render(<ButtonLink href="/courses">Explore</ButtonLink>);
    const link = screen.getByRole("link", { name: "Explore" });
    expect(link).toHaveAttribute("href", "/courses");
  });
});
