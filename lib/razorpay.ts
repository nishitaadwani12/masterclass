import crypto from "node:crypto";

/**
 * Verifies a Razorpay payment signature.
 * Razorpay signs `${order_id}|${payment_id}` with your key secret (HMAC-SHA256).
 * Uses a constant-time comparison to avoid timing attacks.
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean {
  const { orderId, paymentId, signature, secret } = params;
  if (!orderId || !paymentId || !signature || !secret) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const providedBuf = Buffer.from(signature, "utf8");
  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

/** A short, unique receipt id for an order. */
export function buildReceipt(courseSlug: string, now: Date = new Date()): string {
  return `rcpt_${courseSlug}_${now.getTime()}`;
}
