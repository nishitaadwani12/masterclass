"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/lib/types";
import {
  loadRazorpayScript,
  buildCheckoutOptions,
  type OrderResponse,
  type RazorpaySuccess,
} from "@/lib/checkout";
import { Button } from "./ui/Button";

type Status = "idle" | "loading" | "error";

export function CheckoutButton({ course }: { course: Course }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function startCheckout() {
    setStatus("loading");
    setMessage("");
    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug }),
      });

      if (orderRes.status === 401) {
        router.push(`/login?next=/courses/${course.slug}`);
        return;
      }
      if (!orderRes.ok) {
        throw new Error("We couldn't start checkout. Please try again.");
      }

      const order = (await orderRes.json()) as OrderResponse;

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error("Payment SDK failed to load. Check your connection.");
      }

      const options = buildCheckoutOptions({
        order,
        onDismiss: () => setStatus("idle"),
        onSuccess: async (response: RazorpaySuccess) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, courseSlug: course.slug }),
          });
          if (!verifyRes.ok) {
            setStatus("error");
            setMessage("Payment could not be verified. Contact support.");
            return;
          }
          router.push("/dashboard?enrolled=" + course.slug);
        },
      });

      new window.Razorpay(options).open();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="lg"
        onClick={startCheckout}
        disabled={status === "loading"}
        aria-busy={status === "loading"}
      >
        {status === "loading" ? "Starting checkout…" : "Enroll now"}
      </Button>
      {status === "error" ? (
        <p role="alert" className="text-sm text-red-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}
