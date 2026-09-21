import { describe, it, expect, beforeEach, vi } from "vitest";

const getUser = vi.fn();
const ordersCreate = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser } }),
}));

vi.mock("razorpay", () => ({
  default: vi.fn().mockImplementation(() => ({
    orders: { create: ordersCreate },
  })),
}));

import { POST } from "./route";

function req(body: string) {
  return new Request("http://localhost/api/razorpay/order", {
    method: "POST",
    body,
  });
}

const authed = () => getUser.mockResolvedValue({ data: { user: { id: "u1" } } });

describe("POST /api/razorpay/order", () => {
  beforeEach(() => {
    getUser.mockReset();
    ordersCreate.mockReset();
    process.env.RAZORPAY_KEY_ID = "rzp_test_id";
    process.env.RAZORPAY_KEY_SECRET = "secret";
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = "rzp_public_id";
  });

  it("returns 401 when not signed in", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const res = await POST(req(JSON.stringify({ courseSlug: "x" })));
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid JSON", async () => {
    authed();
    const res = await POST(req("{not-json"));
    expect(res.status).toBe(400);
  });

  it("returns 400 on schema failure", async () => {
    authed();
    const res = await POST(req(JSON.stringify({})));
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown course", async () => {
    authed();
    const res = await POST(req(JSON.stringify({ courseSlug: "nope" })));
    expect(res.status).toBe(404);
  });

  it("returns 500 when Razorpay keys are not configured", async () => {
    authed();
    delete process.env.RAZORPAY_KEY_ID;
    const res = await POST(
      req(JSON.stringify({ courseSlug: "sde-interview-mastery" })),
    );
    expect(res.status).toBe(500);
  });

  it("returns 502 when order creation throws", async () => {
    authed();
    ordersCreate.mockRejectedValue(new Error("rzp down"));
    const res = await POST(
      req(JSON.stringify({ courseSlug: "sde-interview-mastery" })),
    );
    expect(res.status).toBe(502);
  });

  it("creates an order and returns the public key id", async () => {
    authed();
    ordersCreate.mockResolvedValue({ id: "order_abc" });
    const res = await POST(
      req(JSON.stringify({ courseSlug: "sde-interview-mastery" })),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.orderId).toBe("order_abc");
    expect(json.currency).toBe("INR");
    expect(json.keyId).toBe("rzp_public_id");
    expect(json.courseTitle).toBe("SDE Interview Mastery");
    expect(json.amount).toBeGreaterThan(0);
  });

  it("falls back to the secret key id when no public key is set", async () => {
    authed();
    delete process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    ordersCreate.mockResolvedValue({ id: "order_def" });
    const res = await POST(
      req(JSON.stringify({ courseSlug: "sde-interview-mastery" })),
    );
    const json = await res.json();
    expect(json.keyId).toBe("rzp_test_id");
  });
});
