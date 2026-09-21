import type { Audience, CourseFormat } from "./types";

const AUDIENCE_LABELS: Record<Audience, string> = {
  mba: "MBA",
  engineering: "Engineering",
  both: "MBA & Engineering",
};

const FORMAT_LABELS: Record<CourseFormat, string> = {
  "self-paced": "Self-paced",
  "live-cohort": "Live cohort",
  mentorship: "1:1 Mentorship",
};

export function audienceLabel(audience: Audience): string {
  return AUDIENCE_LABELS[audience];
}

export function formatLabel(format: CourseFormat): string {
  return FORMAT_LABELS[format];
}

/** Formats an ISO date string as e.g. "Mon, 5 Oct · 7:00 PM" in IST. */
export function formatClassTime(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
}
