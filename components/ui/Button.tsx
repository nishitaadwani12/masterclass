import Link from "next/link";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-violet to-indigo text-white shadow-[0_8px_30px_rgba(124,92,255,0.35)] hover:brightness-110 hover:-translate-y-0.5",
  secondary:
    "bg-gold text-ink hover:brightness-105 hover:-translate-y-0.5",
  ghost:
    "border border-line text-text hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
): string {
  return clsx(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
