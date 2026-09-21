/**
 * Zoom join links per course. Kept OUT of the public course catalogue and
 * imported only from Server Components, so the links are never shipped to the
 * browser for non-enrolled visitors. Replace the placeholders with your real
 * Zoom meeting links.
 */
const ZOOM_LINKS: Record<string, string> = {
  "product-management-transition": "https://zoom.us/j/0000000001",
  "sde-interview-mastery": "https://zoom.us/j/0000000002",
  "consulting-case-prep": "https://zoom.us/j/0000000003",
  "career-clarity-1on1": "https://zoom.us/j/0000000004",
};

/** Returns the Zoom link for a course, or undefined if none is configured. */
export function getZoomUrl(slug: string): string | undefined {
  return ZOOM_LINKS[slug];
}
