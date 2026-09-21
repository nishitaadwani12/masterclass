import { describe, it, expect, beforeEach, vi } from "vitest";
import crypto from "node:crypto";

const getUser = vi.fn();
const insert = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser },
    from: () => ({ insert }),
  }),
}));

import { POST } from "./route";

const SECRET = "verify_secret";

function signature(orderId: string, paymentId: string, secret = SECRET) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

function req(body: string) {
  return new Request("http://localhost/api/razorpay/verify", {
    method: "POST",
    body,
  });
}

function validBody(sig?: string) {
  return JSON.stringify({
    razorpay_order_id: "order_1",
    razorpay_payment_id: "pay_1",
    razorpay_signature: sig ?? signature("order_1", "pay_1"),
    courseSlug: "sde-interview-mastery",
  });
}

const authed = () => getUser.mockResolvedValue({ data: { user: { id: "u1" } } });

describe("POST /api/razorpay/verify", () => {
  beforeEach(() => {
    getUser.mockReset();
    insert.mockReset();
    process.env.RAZORPAY_KEY_SECRET = SECRET;
  });

  it("returns 401 when not signed in", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const res = await POST(req(validBody()));
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid JSON", async () => {
    authed();
    const res = await POST(req("{bad"));
    expect(res.status).toBe(400);
  });

  it("returns 400 on schema failure", async () => {
    authed();
    const res = await POST(req(JSON.stringify({ razorpay_order_id: "o" })));
    expect(res.status).toBe(400);
  });

  it("returns 500 when the secret is not configured", async () => {
    authed();
    delete process.env.RAZORPAY_KEY_SECRET;
    const res = await POST(req(validBody()));
    expect(res.status).toBe(500);
  });

  it("returns 400 for an invalid signature", async () => {
    authed();
    const res = await POST(req(validBody(signature("order_1", "pay_1", "wrong"))));
    expect(res.status).toBe(400);
  });

  it("returns 500 when recording the enrollment fails", async () => {
    authed();
    insert.mockResolvedValue({ error: { message: "db down" } });
    const res = await POST(req(validBody()));
    expect(res.status).toBe(500);
  });

  it("verifies the payment and records the enrollment", async () => {
    authed();
    insert.mockResolvedValue({ error: null });
    const res = await POST(req(validBody()));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ verified: true });
    expect(insert).toHaveBeenCalledWith({
      user_id: "u1",
      course_slug: "sde-interview-mastery",
      payment_id: "pay_1",
      order_id: "order_1",
    });
  });
});
