/**
 * Cloudflare Web Analytics beacon. Renders only when NEXT_PUBLIC_CF_BEACON_TOKEN
 * is set, so it's a no-op until you add the token from the Cloudflare dashboard.
 */
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) {
    return null;
  }
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
