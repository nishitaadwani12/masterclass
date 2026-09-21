import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
const signUp = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { signUp } }),
}));

import { SignupForm } from "./SignupForm";

async function fillValid(password = "supersecret", confirm = "supersecret") {
  await userEvent.type(screen.getByLabelText("Full name"), "Nishita A");
  await userEvent.type(screen.getByLabelText("Email"), "n@example.com");
  await userEvent.type(screen.getByLabelText("Password"), password);
  await userEvent.type(screen.getByLabelText("Confirm password"), confirm);
}

describe("SignupForm", () => {
  beforeEach(() => {
    push.mockReset();
    signUp.mockReset();
  });

  it("blocks submission when passwords do not match", async () => {
    render(<SignupForm />);
    await fillValid("supersecret", "different1");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  it("redirects to the dashboard when a session is returned", async () => {
    signUp.mockResolvedValue({ data: { session: { access_token: "x" } }, error: null });
    render(<SignupForm />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(signUp).toHaveBeenCalledWith({
      email: "n@example.com",
      password: "supersecret",
      options: { data: { full_name: "Nishita A", audience: "mba" } },
    });
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows a confirm-email message when no session is returned", async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: null });
    render(<SignupForm />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Check your inbox");
    expect(push).not.toHaveBeenCalled();
  });

  it("surfaces a signup error", async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: { message: "Email taken" } });
    render(<SignupForm />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email taken");
  });
});
