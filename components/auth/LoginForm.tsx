"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, fieldErrors } from "@/lib/validation";
import { readField } from "@/lib/forms";
import { Button } from "@/components/ui/Button";
import { Field } from "./Field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      email: readField(form, "email"),
      password: readField(form, "password"),
    };

    const validation = fieldErrors(loginSchema, values);
    if (validation) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setErrors({});
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    setSubmitting(false);

    if (error) {
      setErrors({ form: error.message });
      return;
    }
    router.push(next);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {errors.form ? (
        <p role="alert" className="text-sm text-red-300">
          {errors.form}
        </p>
      ) : null}

      <Field label="Email" name="email" type="email" error={errors.email} />
      <Field
        label="Password"
        name="password"
        type="password"
        error={errors.password}
      />

      <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
        {submitting ? "Signing in…" : "Log in"}
      </Button>

      <p className="text-center text-sm text-text-muted">
        New here?{" "}
        <Link href="/signup" className="text-violet-bright hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
