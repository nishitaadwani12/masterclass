import { describe, it, expect } from "vitest";
import { audienceLabel, formatLabel, formatClassTime } from "./format";

describe("format", () => {
  it("labels audiences", () => {
    expect(audienceLabel("mba")).toBe("MBA");
    expect(audienceLabel("engineering")).toBe("Engineering");
    expect(audienceLabel("both")).toBe("MBA & Engineering");
  });

  it("labels formats", () => {
    expect(formatLabel("self-paced")).toBe("Self-paced");
    expect(formatLabel("live-cohort")).toBe("Live cohort");
    expect(formatLabel("mentorship")).toBe("1:1 Mentorship");
  });

  it("formats a class time in IST", () => {
    // 13:30 UTC -> 19:00 IST
    const out = formatClassTime("2026-10-05T13:30:00.000Z");
    expect(out).toContain("Oct");
    expect(out).toMatch(/7:00/);
  });
});
