"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, fieldErrors } from "@/lib/validation";
import { readField } from "@/lib/forms";
import { Button } from "@/components/ui/Button";
import { Field } from "./Field";

export function SignupForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      fullName: readField(form, "fullName"),
      email: readField(form, "email"),
      password: readField(form, "password"),
      confirmPassword: readField(form, "confirmPassword"),
      audience: readField(form, "audience"),
    };

    const validation = fieldErrors(signupSchema, values);
    if (validation) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setErrors({});
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, audience: values.audience },
      },
    });
    setSubmitting(false);

    if (error) {
      setErrors({ form: error.message });
      return;
    }

    // If email confirmation is on, there is no active session yet.
    if (data.session) {
      router.push("/dashboard");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div role="status" className="glass rounded-2xl p-6 text-center">
        <h2 className="font-display text-xl text-text">Check your inbox</h2>
        <p className="mt-2 text-sm text-text-muted">
          We&apos;ve sent a confirmation link to verify your email. Confirm it to
          start learning.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {errors.form ? (
        <p role="alert" className="text-sm text-red-300">
          {errors.form}
        </p>
      ) : null}

      <Field label="Full name" name="fullName" error={errors.fullName} />
      <Field label="Email" name="email" type="email" error={errors.email} />
      <Field
        label="Password"
        name="password"
        type="password"
        error={errors.password}
      />
      <Field
        label="Confirm password"
        name="confirmPassword"
        type="password"
        error={errors.confirmPassword}
      />

      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="text-text-muted">Your background</legend>
        <div className="flex gap-3">
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5">
            <input type="radio" name="audience" value="mba" defaultChecked />
            MBA
          </label>
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5">
            <input type="radio" name="audience" value="engineering" />
            Engineering
          </label>
        </div>
      </fieldset>

      <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-bright hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
