import { describe, it, expect, afterEach, vi } from "vitest";
import {
  loadRazorpayScript,
  buildCheckoutOptions,
  RAZORPAY_SCRIPT_SRC,
  type OrderResponse,
} from "./checkout";

const order: OrderResponse = {
  orderId: "order_1",
  amount: 100000,
  currency: "INR",
  keyId: "rzp_test_123",
  courseTitle: "SDE Interview Mastery",
};

describe("buildCheckoutOptions", () => {
  it("maps order fields and wires callbacks", () => {
    const onSuccess = vi.fn();
    const onDismiss = vi.fn();
    const opts = buildCheckoutOptions({ order, onSuccess, onDismiss });

    expect(opts.key).toBe("rzp_test_123");
    expect(opts.amount).toBe(100000);
    expect(opts.currency).toBe("INR");
    expect(opts.order_id).toBe("order_1");
    expect(opts.description).toBe("SDE Interview Mastery");
    expect(opts.name).toBe("SwitchPath");
    expect(opts.theme.color).toBe("#7c5cff");

    const success = {
      razorpay_order_id: "o",
      razorpay_payment_id: "p",
      razorpay_signature: "s",
    };
    opts.handler(success);
    opts.modal.ondismiss();
    expect(onSuccess).toHaveBeenCalledWith(success);
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe("loadRazorpayScript", () => {
  afterEach(() => {
    delete window.Razorpay;
    document.querySelectorAll("script").forEach((s) => s.remove());
  });

  it("resolves true immediately when Razorpay is already present", async () => {
    window.Razorpay = vi.fn() as unknown as typeof window.Razorpay;
    await expect(loadRazorpayScript()).resolves.toBe(true);
  });

  it("injects a script and resolves true on load", async () => {
    const promise = loadRazorpayScript(document);
    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`,
    );
    expect(script).not.toBeNull();
    script!.dispatchEvent(new Event("load"));
    await expect(promise).resolves.toBe(true);
  });

  it("resolves false when the injected script errors", async () => {
    const promise = loadRazorpayScript(document);
    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`,
    );
    script!.dispatchEvent(new Event("error"));
    await expect(promise).resolves.toBe(false);
  });

  it("reuses an existing script tag and resolves on its load", async () => {
    const existing = document.createElement("script");
    existing.src = RAZORPAY_SCRIPT_SRC;
    document.body.appendChild(existing);

    const promise = loadRazorpayScript(document);
    existing.dispatchEvent(new Event("load"));
    await expect(promise).resolves.toBe(true);
  });

  it("resolves false when an existing script errors", async () => {
    const existing = document.createElement("script");
    existing.src = RAZORPAY_SCRIPT_SRC;
    document.body.appendChild(existing);

    const promise = loadRazorpayScript(document);
    existing.dispatchEvent(new Event("error"));
    await expect(promise).resolves.toBe(false);
  });
});
