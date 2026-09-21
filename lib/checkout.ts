export const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  courseTitle: string;
}

export interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccess) => void;
  modal: { ondismiss: () => void };
  theme: { color: string };
}

export interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/**
 * Ensures the Razorpay checkout script is loaded. Resolves true when available.
 * Injectable document for testing.
 */
export function loadRazorpayScript(doc: Document = document): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = doc.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = doc.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.addEventListener("load", () => resolve(true));
    script.addEventListener("error", () => resolve(false));
    doc.body.appendChild(script);
  });
}

/** Builds the options object passed to `new Razorpay(...)`. */
export function buildCheckoutOptions(params: {
  order: OrderResponse;
  onSuccess: (response: RazorpaySuccess) => void;
  onDismiss: () => void;
}): RazorpayOptions {
  const { order, onSuccess, onDismiss } = params;
  return {
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    name: "SwitchPath",
    description: order.courseTitle,
    order_id: order.orderId,
    handler: onSuccess,
    modal: { ondismiss: onDismiss },
    theme: { color: "#7c5cff" },
  };
}
