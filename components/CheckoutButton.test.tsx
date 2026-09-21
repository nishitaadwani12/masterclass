import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Course } from "@/lib/types";

const { push, loadRazorpayScript } = vi.hoisted(() => ({
  push: vi.fn(),
  loadRazorpayScript: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

vi.mock("@/lib/checkout", async (importActual) => {
  const actual = await importActual<typeof import("@/lib/checkout")>();
  return { ...actual, loadRazorpayScript };
});

import { CheckoutButton } from "./CheckoutButton";

const course: Course = {
  slug: "demo",
  title: "Demo Course",
  subtitle: "s",
  description: "d",
  audience: "engineering",
  level: "beginner",
  format: "live-cohort",
  durationWeeks: 4,
  priceInPaise: 100000,
  outcomes: [],
  modules: [],
};

const orderPayload = {
  orderId: "order_1",
  amount: 118000,
  currency: "INR",
  keyId: "rzp_test",
  courseTitle: "Demo Course",
};

function resp(body: unknown, init: { ok: boolean; status?: number }) {
  return Promise.resolve({
    ok: init.ok,
    status: init.status ?? (init.ok ? 200 : 400),
    json: async () => body,
  } as Response);
}

let capturedOptions: {
  handler: (r: unknown) => Promise<void> | void;
  modal: { ondismiss: () => void };
} | null = null;
const open = vi.fn();

class RazorpayMock {
  constructor(opts: unknown) {
    capturedOptions = opts as typeof capturedOptions;
  }
  open = open;
}

async function click() {
  await userEvent.click(screen.getByRole("button", { name: /Enroll now/ }));
}

describe("CheckoutButton", () => {
  beforeEach(() => {
    push.mockReset();
    loadRazorpayScript.mockReset();
    open.mockReset();
    capturedOptions = null;
    window.Razorpay = RazorpayMock as unknown as typeof window.Razorpay;
  });

  afterEach(() => {
    delete window.Razorpay;
    vi.unstubAllGlobals();
  });

  it("redirects to login when the order call is unauthorized", async () => {
    vi.stubGlobal("fetch", vi.fn(() => resp({ error: "Unauthorized" }, { ok: false, status: 401 })));
    render(<CheckoutButton course={course} />);
    await click();
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/login?next=/courses/demo"),
    );
  });

  it("shows an error when the order call fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => resp({ error: "boom" }, { ok: false, status: 500 })));
    render(<CheckoutButton course={course} />);
    await click();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "couldn't start checkout",
    );
  });

  it("shows an error when the SDK script fails to load", async () => {
    vi.stubGlobal("fetch", vi.fn(() => resp(orderPayload, { ok: true })));
    loadRazorpayScript.mockResolvedValue(false);
    render(<CheckoutButton course={course} />);
    await click();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Payment SDK failed to load",
    );
  });

  it("shows an error when the SDK global is missing after load", async () => {
    vi.stubGlobal("fetch", vi.fn(() => resp(orderPayload, { ok: true })));
    loadRazorpayScript.mockResolvedValue(true);
    delete window.Razorpay;
    render(<CheckoutButton course={course} />);
    await click();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Payment SDK failed to load",
    );
  });

  it("opens checkout and enrolls on successful verification", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => resp(orderPayload, { ok: true }))
      .mockImplementationOnce(() => resp({ verified: true }, { ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    loadRazorpayScript.mockResolvedValue(true);

    render(<CheckoutButton course={course} />);
    await click();

    await waitFor(() => expect(open).toHaveBeenCalled());
    await capturedOptions!.handler({
      razorpay_order_id: "o",
      razorpay_payment_id: "p",
      razorpay_signature: "s",
    });
    expect(push).toHaveBeenCalledWith("/dashboard?enrolled=demo");
  });

  it("shows an error when verification fails", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => resp(orderPayload, { ok: true }))
      .mockImplementationOnce(() => resp({ error: "bad sig" }, { ok: false }));
    vi.stubGlobal("fetch", fetchMock);
    loadRazorpayScript.mockResolvedValue(true);

    render(<CheckoutButton course={course} />);
    await click();
    await waitFor(() => expect(capturedOptions).not.toBeNull());
    await capturedOptions!.handler({
      razorpay_order_id: "o",
      razorpay_payment_id: "p",
      razorpay_signature: "s",
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "could not be verified",
    );
  });

  it("returns to idle when the modal is dismissed", async () => {
    vi.stubGlobal("fetch", vi.fn(() => resp(orderPayload, { ok: true })));
    loadRazorpayScript.mockResolvedValue(true);
    render(<CheckoutButton course={course} />);
    await click();
    await waitFor(() => expect(capturedOptions).not.toBeNull());
    capturedOptions!.modal.ondismiss();
    expect(
      await screen.findByRole("button", { name: "Enroll now" }),
    ).not.toBeDisabled();
  });

  it("shows a generic error when a non-Error is thrown", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject("string failure")),
    );
    render(<CheckoutButton course={course} />);
    await click();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong",
    );
  });
});
