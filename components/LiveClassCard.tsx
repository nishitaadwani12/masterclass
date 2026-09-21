import type { LiveClass } from "@/lib/types";
import { seatsRemaining, isSoldOut, isFillingFast } from "@/lib/liveClasses";
import { audienceLabel, formatClassTime } from "@/lib/format";
import { Badge } from "./ui/Badge";

export function LiveClassCard({ liveClass }: { liveClass: LiveClass }) {
  const soldOut = isSoldOut(liveClass);
  const fillingFast = isFillingFast(liveClass);
  const remaining = seatsRemaining(liveClass);

  return (
    <article
      className="glass flex flex-col gap-3 rounded-2xl p-6"
      data-testid="live-class-card"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge tone="muted">{audienceLabel(liveClass.audience)}</Badge>
        {soldOut ? (
          <Badge tone="danger">Sold out</Badge>
        ) : fillingFast ? (
          <Badge tone="gold">Filling fast</Badge>
        ) : (
          <Badge tone="violet">{remaining} seats left</Badge>
        )}
      </div>

      <h3 className="font-display text-lg text-text">{liveClass.title}</h3>

      <dl className="mt-1 space-y-1 text-sm text-text-muted">
        <div className="flex justify-between">
          <dt>Mentor</dt>
          <dd className="text-text">{liveClass.mentor}</dd>
        </div>
        <div className="flex justify-between">
          <dt>When</dt>
          <dd className="text-text">{formatClassTime(liveClass.startsAt)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Duration</dt>
          <dd className="text-text">{liveClass.durationMinutes} min</dd>
        </div>
      </dl>
    </article>
  );
}
