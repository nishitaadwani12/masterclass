import { describe, it, expect } from "vitest";
import {
  paiseToRupees,
  rupeesToPaise,
  formatInr,
  gstAmount,
  priceWithGst,
  discountPercent,
} from "./pricing";

describe("pricing", () => {
  it("converts paise to rupees and back", () => {
    expect(paiseToRupees(499900)).toBe(4999);
    expect(rupeesToPaise(4999)).toBe(499900);
    expect(rupeesToPaise(49.99)).toBe(4999);
  });

  it("formats whole-rupee amounts without decimals", () => {
    expect(formatInr(499900)).toBe("₹4,999");
  });

  it("formats fractional-rupee amounts with two decimals", () => {
    expect(formatInr(499950)).toBe("₹4,999.50");
  });

  it("computes 18% GST rounded to whole paise", () => {
    expect(gstAmount(100000)).toBe(18000);
    expect(gstAmount(4999900)).toBe(899982);
  });

  it("adds GST to a price", () => {
    expect(priceWithGst(100000)).toBe(118000);
  });

  it("computes a discount percentage when list price is higher", () => {
    expect(discountPercent(4999900, 7499900)).toBe(33);
  });

  it("returns 0 discount when there is no list price", () => {
    expect(discountPercent(4999900)).toBe(0);
  });

  it("returns 0 discount when list price is not higher", () => {
    expect(discountPercent(5000000, 4999900)).toBe(0);
    expect(discountPercent(5000000, 5000000)).toBe(0);
  });
});
