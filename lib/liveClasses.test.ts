import { describe, it, expect } from "vitest";
import {
  LIVE_CLASSES,
  getUpcomingLiveClasses,
  seatsRemaining,
  isSoldOut,
  isFillingFast,
} from "./liveClasses";
import type { LiveClass } from "./types";

const make = (over: Partial<LiveClass>): LiveClass => ({
  id: "x",
  title: "t",
  mentor: "m",
  audience: "both",
  startsAt: "2026-10-05T13:30:00.000Z",
  durationMinutes: 60,
  seatsTotal: 100,
  seatsTaken: 0,
  ...over,
});

describe("liveClasses", () => {
  it("returns upcoming classes sorted by start time", () => {
    const now = new Date("2026-10-01T00:00:00.000Z");
    const upcoming = getUpcomingLiveClasses(now);
    expect(upcoming.length).toBe(LIVE_CLASSES.length);
    for (let i = 1; i < upcoming.length; i++) {
      expect(new Date(upcoming[i].startsAt).getTime()).toBeGreaterThanOrEqual(
        new Date(upcoming[i - 1].startsAt).getTime(),
      );
    }
  });

  it("excludes classes in the past", () => {
    const now = new Date("2100-01-01T00:00:00.000Z");
    expect(getUpcomingLiveClasses(now)).toHaveLength(0);
  });

  it("uses the current time by default", () => {
    expect(Array.isArray(getUpcomingLiveClasses())).toBe(true);
  });

  it("computes remaining seats and never goes negative", () => {
    expect(seatsRemaining(make({ seatsTotal: 100, seatsTaken: 60 }))).toBe(40);
    expect(seatsRemaining(make({ seatsTotal: 100, seatsTaken: 120 }))).toBe(0);
  });

  it("detects sold-out classes", () => {
    expect(isSoldOut(make({ seatsTaken: 100 }))).toBe(true);
    expect(isSoldOut(make({ seatsTaken: 50 }))).toBe(false);
  });

  it("flags filling-fast classes (under 20% left, not sold out)", () => {
    expect(isFillingFast(make({ seatsTotal: 100, seatsTaken: 90 }))).toBe(true);
    expect(isFillingFast(make({ seatsTotal: 100, seatsTaken: 50 }))).toBe(false);
    expect(isFillingFast(make({ seatsTotal: 100, seatsTaken: 100 }))).toBe(false);
  });
});
