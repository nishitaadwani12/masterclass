import { describe, it, expect } from "vitest";
import { readField } from "./forms";

describe("readField", () => {
  it("returns a string value", () => {
    const form = new FormData();
    form.set("email", "a@b.com");
    expect(readField(form, "email")).toBe("a@b.com");
  });

  it("returns empty string for a missing field", () => {
    expect(readField(new FormData(), "missing")).toBe("");
  });

  it("returns empty string for a non-string (File) value", () => {
    const form = new FormData();
    form.set("file", new File(["x"], "x.txt"));
    expect(readField(form, "file")).toBe("");
  });
});
