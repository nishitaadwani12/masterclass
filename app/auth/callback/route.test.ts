import { describe, it, expect, beforeEach, vi } from "vitest";

const exchangeCodeForSession = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { exchangeCodeForSession } }),
}));

import { GET } from "./route";

function get(url: string) {
  return GET(new Request(url));
}

describe("GET /auth/callback", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset();
  });

  it("exchanges the code and redirects to next", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    const res = await get("http://localhost:3000/auth/callback?code=abc&next=/courses");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/courses");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc");
  });

  it("defaults next to /dashboard", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    const res = await get("http://localhost:3000/auth/callback?code=abc");
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("redirects to login when the exchange fails", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: { message: "bad code" } });
    const res = await get("http://localhost:3000/auth/callback?code=abc");
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/login?error=oauth_failed",
    );
  });

  it("redirects to login when no code is present", async () => {
    const res = await get("http://localhost:3000/auth/callback");
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/login?error=oauth_failed",
    );
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
  });
});
