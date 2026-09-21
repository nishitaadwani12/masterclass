import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Sign up — Masterclass" };

export default function SignupPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20">
      <h1 className="font-display text-3xl">Create your account</h1>
      <p className="mt-2 text-text-muted">
        Start with a free account and pick your track.
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
    </div>
  );
}
