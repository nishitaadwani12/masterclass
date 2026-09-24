import type { Metadata } from "next";
import { LegalPage, BUSINESS } from "../legal/legalContent";

export const metadata: Metadata = { title: "Terms of Service | SwitchPath" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These Terms of Service govern your use of {BUSINESS.name} (&quot;we&quot;,
        &quot;us&quot;), an online learning platform offering courses, live
        classes and mentorship for students. By creating an account or making a
        purchase, you agree to these terms.
      </p>

      <h2>1. Accounts</h2>
      <p>
        You must provide accurate information when signing up and are responsible
        for keeping your login credentials secure. You must be a student or
        otherwise eligible to use our services.
      </p>

      <h2>2. Purchases and access</h2>
      <p>
        Course and mentorship prices are shown in Indian Rupees (INR), inclusive
        of applicable taxes. On successful payment you receive access to the
        purchased program, including any live-class links, for the stated
        duration. Access is for your personal, non-transferable use.
      </p>

      <h2>3. Live classes and content</h2>
      <p>
        Class schedules, mentors and content may change. Recordings and materials
        are for enrolled students only and may not be redistributed.
      </p>

      <h2>4. Payments</h2>
      <p>
        Payments are processed securely through Razorpay. We do not store your
        card or bank details. Refunds are governed by our{" "}
        <a href="/refund">Cancellation &amp; Refund Policy</a>.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        You agree not to misuse the platform, share paid content, or disrupt the
        service. We may suspend accounts that violate these terms.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        Our services are provided on an &quot;as is&quot; basis. We are not
        liable for outcomes such as specific job offers or role changes.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>
    </LegalPage>
  );
}
