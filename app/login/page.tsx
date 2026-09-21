import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log in — Masterclass" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20">
      <h1 className="font-display text-3xl">Welcome back</h1>
      <p className="mt-2 text-text-muted">Log in to continue learning.</p>
      <div className="mt-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
