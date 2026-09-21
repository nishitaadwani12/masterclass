"use client";

import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";
import { ButtonLink } from "./ui/Button";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/live-classes", label: "Live Classes" },
  { href: "/#how-it-works", label: "How it works" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet to-gold text-ink font-bold"
          >
            M
          </span>
          <span className="text-gradient font-semibold">Masterclass</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Log in
          </Link>
          <ButtonLink href="/signup" size="sm">
            Get started
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="rounded-lg border border-line p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-5 bg-text" />
          <span className="mt-1 block h-0.5 w-5 bg-text" />
          <span className="mt-1 block h-0.5 w-5 bg-text" />
        </button>
      </nav>

      <div
        className={clsx(
          "bg-ink/95 backdrop-blur-xl md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-3 px-5 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="text-sm text-text-muted">
            Log in
          </Link>
          <ButtonLink href="/signup" size="sm">
            Get started
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
