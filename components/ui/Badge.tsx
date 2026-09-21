import { clsx } from "clsx";
import type { ReactNode } from "react";

type Tone = "violet" | "gold" | "muted" | "danger";

const tones: Record<Tone, string> = {
  violet: "bg-violet/15 text-violet-bright border-violet/30",
  gold: "bg-gold/15 text-gold-bright border-gold/30",
  muted: "bg-surface-2 text-text-muted border-line",
  danger: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function Badge({
  tone = "muted",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
