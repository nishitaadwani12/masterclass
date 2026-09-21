import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifyPaymentSignature, buildReceipt } from "./razorpay";

const secret = "test_secret_key";
const orderId = "order_123";
const paymentId = "pay_456";

function sign(o: string, p: string, s: string): string {
  return crypto.createHmac("sha256", s).update(`${o}|${p}`).digest("hex");
}

describe("verifyPaymentSignature", () => {
  it("accepts a correct signature", () => {
    const signature = sign(orderId, paymentId, secret);
    expect(verifyPaymentSignature({ orderId, paymentId, signature, secret })).toBe(true);
  });

  it("rejects a tampered signature of the same length", () => {
    const good = sign(orderId, paymentId, secret);
    const bad = good.slice(0, -1) + (good.endsWith("a") ? "b" : "a");
    expect(verifyPaymentSignature({ orderId, paymentId, signature: bad, secret })).toBe(false);
  });

  it("rejects a signature of a different length", () => {
    expect(
      verifyPaymentSignature({ orderId, paymentId, signature: "short", secret }),
    ).toBe(false);
  });

  it("rejects a signature made with the wrong secret", () => {
    const signature = sign(orderId, paymentId, "wrong_secret");
    expect(verifyPaymentSignature({ orderId, paymentId, signature, secret })).toBe(false);
  });

  it("rejects when any field is missing", () => {
    expect(verifyPaymentSignature({ orderId: "", paymentId, signature: "s", secret })).toBe(false);
    expect(verifyPaymentSignature({ orderId, paymentId: "", signature: "s", secret })).toBe(false);
    expect(verifyPaymentSignature({ orderId, paymentId, signature: "", secret })).toBe(false);
    expect(verifyPaymentSignature({ orderId, paymentId, signature: "s", secret: "" })).toBe(false);
  });
});

describe("buildReceipt", () => {
  it("builds a receipt containing the slug and timestamp", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    expect(buildReceipt("sde", now)).toBe(`rcpt_sde_${now.getTime()}`);
  });

  it("uses current time by default", () => {
    expect(buildReceipt("pm")).toMatch(/^rcpt_pm_\d+$/);
  });
});
