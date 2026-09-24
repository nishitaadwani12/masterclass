import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { CloudflareAnalytics } from "./CloudflareAnalytics";

const KEY = "NEXT_PUBLIC_CF_BEACON_TOKEN";

describe("CloudflareAnalytics", () => {
  afterEach(() => {
    delete process.env[KEY];
  });

  it("renders nothing when no beacon token is set", () => {
    delete process.env[KEY];
    const { container } = render(<CloudflareAnalytics />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("renders the beacon script with the token when set", () => {
    process.env[KEY] = "abc123";
    const { container } = render(<CloudflareAnalytics />);
    const script = container.querySelector("script[data-cf-beacon]");
    expect(script).not.toBeNull();
    expect(script?.getAttribute("src")).toContain("cloudflareinsights.com/beacon");
    expect(script?.getAttribute("data-cf-beacon")).toContain("abc123");
  });
});
