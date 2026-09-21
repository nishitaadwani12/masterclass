import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const signInWithOAuth = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { signInWithOAuth } }),
}));

import { SocialAuth } from "./SocialAuth";

describe("SocialAuth", () => {
  beforeEach(() => {
    signInWithOAuth.mockReset();
  });

  it("renders Google and GitHub buttons plus an email divider", () => {
    render(<SocialAuth />);
    expect(screen.getByRole("button", { name: /Google/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GitHub/ })).toBeInTheDocument();
    expect(screen.getByText(/or continue with email/i)).toBeInTheDocument();
  });

  it("starts Google OAuth with a callback redirect to the default next", async () => {
    signInWithOAuth.mockResolvedValue({ error: null });
    render(<SocialAuth />);
    await userEvent.click(screen.getByRole("button", { name: /Google/ }));

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback?next=%2Fdashboard",
      },
    });
    expect(await screen.findByText("Redirecting…")).toBeInTheDocument();
  });

  it("passes a custom next destination through the redirect", async () => {
    signInWithOAuth.mockResolvedValue({ error: null });
    render(<SocialAuth next="/courses/sde-interview-mastery" />);
    await userEvent.click(screen.getByRole("button", { name: /GitHub/ }));

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: {
        redirectTo:
          "http://localhost:3000/auth/callback?next=%2Fcourses%2Fsde-interview-mastery",
      },
    });
  });

  it("surfaces an OAuth error and re-enables the buttons", async () => {
    signInWithOAuth.mockResolvedValue({ error: { message: "OAuth blocked" } });
    render(<SocialAuth />);
    await userEvent.click(screen.getByRole("button", { name: /Google/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent("OAuth blocked");
    expect(screen.getByRole("button", { name: /Google/ })).not.toBeDisabled();
  });
});
