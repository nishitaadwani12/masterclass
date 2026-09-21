import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "./Field";

describe("Field", () => {
  it("renders a labelled input", () => {
    render(<Field label="Email" name="email" type="email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("shows an error message and marks the field invalid", () => {
    render(<Field label="Email" name="email" error="Required" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByText("Required")).toHaveAttribute("id", "email-error");
  });
});
