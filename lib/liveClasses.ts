import type { LiveClass } from "./types";

/**
 * Upcoming live classes. Times are ISO strings; can be sourced from Supabase
 * later without changing the helpers below.
 */
export const LIVE_CLASSES: LiveClass[] = [
  {
    id: "lc-pm-roadmapping",
    title: "Roadmapping Live: build a quarter plan",
    mentor: "Aarti Sharma",
    audience: "both",
    startsAt: "2026-10-05T13:30:00.000Z",
    durationMinutes: 90,
    seatsTotal: 100,
    seatsTaken: 64,
  },
  {
    id: "lc-system-design",
    title: "System Design Teardown: URL shortener",
    mentor: "Rohan Mehta",
    audience: "engineering",
    startsAt: "2026-10-08T15:00:00.000Z",
    durationMinutes: 75,
    seatsTotal: 80,
    seatsTaken: 80,
  },
  {
    id: "lc-consulting-case",
    title: "Live Case Crack: market entry",
    mentor: "Priya Nair",
    audience: "mba",
    startsAt: "2026-10-11T11:00:00.000Z",
    durationMinutes: 60,
    seatsTotal: 60,
    seatsTaken: 42,
  },
];

export function getUpcomingLiveClasses(now: Date = new Date()): LiveClass[] {
  return LIVE_CLASSES.filter(
    (lc) => new Date(lc.startsAt).getTime() >= now.getTime(),
  ).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function seatsRemaining(lc: LiveClass): number {
  return Math.max(0, lc.seatsTotal - lc.seatsTaken);
}

export function isSoldOut(lc: LiveClass): boolean {
  return seatsRemaining(lc) === 0;
}

/** True when fewer than 20% of seats remain (and it isn't sold out). */
export function isFillingFast(lc: LiveClass): boolean {
  const remaining = seatsRemaining(lc);
  return remaining > 0 && remaining / lc.seatsTotal < 0.2;
}
