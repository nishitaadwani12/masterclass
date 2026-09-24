import type { Metadata } from "next";
import { LegalPage, BUSINESS } from "../legal/legalContent";

export const metadata: Metadata = { title: "Privacy Policy | SwitchPath" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {BUSINESS.name} respects your privacy. This policy explains what we
        collect and how we use it.
      </p>

      <h2>Information we collect</h2>
      <p>
        Account details you provide (name, email, background), and records of
        courses you enrol in. Payment is handled by Razorpay; we receive a
        payment confirmation and reference, not your full card or bank details.
      </p>

      <h2>How we use it</h2>
      <p>
        To create your account, give you access to purchased programs and live
        classes, provide support, and improve our services. We do not sell your
        personal data.
      </p>

      <h2>Storage and security</h2>
      <p>
        Data is stored with our infrastructure providers (Supabase for database
        and authentication, Vercel for hosting). Access is protected and limited
        to what each service needs to operate.
      </p>

      <h2>Third-party services</h2>
      <p>
        We use Razorpay for payments and Zoom for live classes; their handling of
        your data is governed by their own policies.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request access to or deletion of your account data by emailing{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, contact{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>
    </LegalPage>
  );
}
