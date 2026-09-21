import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  orderSchema,
  verifySchema,
  fieldErrors,
} from "./validation";

describe("validation schemas", () => {
  it("accepts a valid login", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });

  it("rejects a bad email", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });

  it("accepts a valid signup", () => {
    const ok = signupSchema.safeParse({
      fullName: "Nishita A",
      email: "n@example.com",
      password: "supersecret",
      confirmPassword: "supersecret",
      audience: "mba",
    });
    expect(ok.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const res = signupSchema.safeParse({
      fullName: "Nishita A",
      email: "n@example.com",
      password: "supersecret",
      confirmPassword: "different1",
      audience: "engineering",
    });
    expect(res.success).toBe(false);
  });

  it("rejects an invalid audience", () => {
    const res = signupSchema.safeParse({
      fullName: "Nishita A",
      email: "n@example.com",
      password: "supersecret",
      confirmPassword: "supersecret",
      audience: "other",
    });
    expect(res.success).toBe(false);
  });

  it("validates order and verify payloads", () => {
    expect(orderSchema.safeParse({ courseSlug: "x" }).success).toBe(true);
    expect(orderSchema.safeParse({ courseSlug: "" }).success).toBe(false);
    expect(
      verifySchema.safeParse({
        razorpay_order_id: "o",
        razorpay_payment_id: "p",
        razorpay_signature: "s",
      }).success,
    ).toBe(true);
    expect(verifySchema.safeParse({}).success).toBe(false);
  });
});

describe("fieldErrors", () => {
  it("returns null when valid", () => {
    expect(fieldErrors(loginSchema, { email: "a@b.com", password: "x" })).toBeNull();
  });

  it("maps each field to its first error message", () => {
    const errs = fieldErrors(signupSchema, {
      fullName: "N",
      email: "bad",
      password: "short",
      confirmPassword: "short",
      audience: "mba",
    });
    expect(errs).not.toBeNull();
    expect(errs?.fullName).toBeTruthy();
    expect(errs?.email).toBeTruthy();
    expect(errs?.password).toBeTruthy();
  });

  it("falls back to a 'form' key when there is no path", () => {
    const schema = loginSchema.refine(() => false, { message: "whole-form error" });
    const errs = fieldErrors(schema, { email: "a@b.com", password: "x" });
    expect(errs?.form).toBe("whole-form error");
  });
});
