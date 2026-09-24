import type { ReactNode } from "react";

// Business contact details — EDIT THESE with your real, registered info before
// submitting to Razorpay for live activation.
export const BUSINESS = {
  name: "SwitchPath",
  legalName: "SwitchPath",
  email: "switchpath10@gmail.com",
  phone: "+91-XXXXXXXXXX",
  address: "Add your registered business address here",
  lastUpdated: "24 September 2026",
};

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-text-muted">
        Last updated: {BUSINESS.lastUpdated}
      </p>
      <div className="mt-8 space-y-4 text-text-muted [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-text [&_a]:text-violet-bright [&_a:hover]:underline">
        {children}
      </div>
    </div>
  );
}
