import type { Metadata } from "next";
import { LiveClassCard } from "@/components/LiveClassCard";
import { getUpcomingLiveClasses } from "@/lib/liveClasses";

export const metadata: Metadata = {
  title: "Live Classes — Masterclass",
  description: "Join upcoming live cohorts and workshops with working mentors.",
};

export default function LiveClassesPage() {
  const classes = getUpcomingLiveClasses();
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-4xl">Upcoming live classes</h1>
      <p className="mt-3 max-w-xl text-text-muted">
        Interactive sessions with mentors who&apos;ve made the switch. Seats are
        limited to keep them hands-on.
      </p>

      {classes.length === 0 ? (
        <p className="mt-10 text-text-muted">
          No live classes scheduled right now — new dates drop soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((lc) => (
            <LiveClassCard key={lc.id} liveClass={lc} />
          ))}
        </div>
      )}
    </div>
  );
}
