import type { Metadata } from "next";
import { LegalPage, BUSINESS } from "../legal/legalContent";

export const metadata: Metadata = { title: "Contact Us | SwitchPath" };

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us">
      <p>
        Questions about a program, your account or a payment? We&apos;re happy to
        help.
      </p>

      <h2>Email</h2>
      <p>
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
      </p>

      <h2>Phone</h2>
      <p>{BUSINESS.phone}</p>

      <h2>Business address</h2>
      <p>{BUSINESS.address}</p>

      <h2>Support hours</h2>
      <p>Monday to Saturday, 10:00 AM – 7:00 PM IST.</p>
    </LegalPage>
  );
}
