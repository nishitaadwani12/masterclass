import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

export function Field({ label, name, error, className, ...rest }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-text-muted">{label}</span>
      <input
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={clsx(
          "rounded-xl border bg-surface px-4 py-2.5 text-text outline-none transition-colors focus:border-violet",
          error ? "border-red-500/60" : "border-line",
          className,
        )}
        {...rest}
      />
      {error ? (
        <span id={`${name}-error`} className="text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}
