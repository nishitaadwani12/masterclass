/**
 * Money helpers. All internal amounts are in paise (1 INR = 100 paise),
 * which is also the unit Razorpay expects.
 */

const GST_RATE = 0.18;

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/** Formats paise as an INR string, e.g. 499900 -> "₹4,999". */
export function formatInr(paise: number): string {
  const rupees = paiseToRupees(paise);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}

/** GST portion (18%) of a price given in paise, rounded to whole paise. */
export function gstAmount(priceInPaise: number): number {
  return Math.round(priceInPaise * GST_RATE);
}

/** Price inclusive of GST, in paise. */
export function priceWithGst(priceInPaise: number): number {
  return priceInPaise + gstAmount(priceInPaise);
}

/**
 * Discount percentage from a list price to a sale price.
 * Returns 0 when there is no valid, positive discount.
 */
export function discountPercent(
  priceInPaise: number,
  listPriceInPaise?: number,
): number {
  if (!listPriceInPaise || listPriceInPaise <= priceInPaise) {
    return 0;
  }
  return Math.round(
    ((listPriceInPaise - priceInPaise) / listPriceInPaise) * 100,
  );
}
