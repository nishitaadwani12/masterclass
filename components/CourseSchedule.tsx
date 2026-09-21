import type { CourseSession } from "@/lib/types";
import { formatClassTime } from "@/lib/format";
import { Badge } from "./ui/Badge";

export function CourseSchedule({
  sessions,
  classDetails,
  enrolled,
  zoomUrl,
}: {
  sessions: CourseSession[];
  classDetails?: string;
  enrolled: boolean;
  zoomUrl?: string;
}) {
  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Live classes &amp; schedule</h2>
        {enrolled ? <Badge tone="violet">Enrolled</Badge> : null}
      </div>

      {classDetails ? (
        <p className="mt-3 text-sm text-text-muted">{classDetails}</p>
      ) : null}

      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">
          The schedule will be announced soon.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {sessions.map((session) => (
            <li
              key={session.title}
              className="flex items-center justify-between gap-4 border-b border-line/50 pb-3 last:border-0"
            >
              <span className="text-text">{session.title}</span>
              <span className="shrink-0 text-sm text-text-muted">
                {formatClassTime(session.startsAt)} · {session.durationMinutes} min
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5">
        {enrolled && zoomUrl ? (
          <a
            href={zoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-indigo px-6 py-2.5 text-sm font-medium text-white shadow-[0_8px_30px_rgba(124,92,255,0.35)] transition hover:brightness-110"
          >
            Join live class on Zoom →
          </a>
        ) : (
          <p className="text-sm text-text-muted">
            🔒 Enroll to unlock the Zoom link for every live class.
          </p>
        )}
      </div>
    </section>
  );
}
