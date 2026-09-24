import type { Metadata } from "next";
import { LegalPage, BUSINESS } from "../legal/legalContent";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | SwitchPath",
};

export default function RefundPage() {
  return (
    <LegalPage title="Cancellation &amp; Refund Policy">
      <p>
        We want you to be confident enrolling with {BUSINESS.name}. This policy
        explains cancellations and refunds for our courses, live cohorts and
        mentorship.
      </p>

      <h2>Cancellation window</h2>
      <p>
        You may request a cancellation within <strong>7 days</strong> of purchase,
        provided the program has not yet started and you have not accessed more
        than the first live session or a substantial part of the content.
      </p>

      <h2>Refunds</h2>
      <p>
        Approved refunds are issued to your original payment method via Razorpay,
        typically within 5–7 business days. Once a cohort has started or course
        content has been substantially accessed, fees are non-refundable.
      </p>

      <h2>1:1 mentorship</h2>
      <p>
        Mentorship sessions can be rescheduled with at least 24 hours&apos;
        notice. Missed sessions without notice are not refundable.
      </p>

      <h2>How to request</h2>
      <p>
        Email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> with your
        registered email and payment reference. We respond within 2 business
        days.
      </p>
    </LegalPage>
  );
}
