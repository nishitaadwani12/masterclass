import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
let nextParam: string | null = null;
const signInWithPassword = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: () => nextParam }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { signInWithPassword } }),
}));

import { LoginForm } from "./LoginForm";

async function fillValid() {
  await userEvent.type(screen.getByLabelText("Email"), "user@example.com");
  await userEvent.type(screen.getByLabelText("Password"), "supersecret");
}

describe("LoginForm", () => {
  beforeEach(() => {
    push.mockReset();
    signInWithPassword.mockReset();
    nextParam = null;
  });

  it("shows validation errors and does not call Supabase", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("Email"), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    expect(signInWithPassword).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("logs in and redirects to the default destination", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    render(<LoginForm />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "supersecret",
    });
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects to the ?next destination when present", async () => {
    nextParam = "/courses/sde-interview-mastery";
    signInWithPassword.mockResolvedValue({ error: null });
    render(<LoginForm />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(push).toHaveBeenCalledWith("/courses/sde-interview-mastery");
  });

  it("surfaces an auth error", async () => {
    signInWithPassword.mockResolvedValue({ error: { message: "Invalid login" } });
    render(<LoginForm />);
    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid login");
    expect(push).not.toHaveBeenCalled();
  });
});
