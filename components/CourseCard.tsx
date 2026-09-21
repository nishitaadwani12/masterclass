import Link from "next/link";
import type { Course } from "@/lib/types";
import { formatInr, discountPercent } from "@/lib/pricing";
import { audienceLabel, formatLabel } from "@/lib/format";
import { Badge } from "./ui/Badge";

export function CourseCard({ course }: { course: Course }) {
  const discount = discountPercent(course.priceInPaise, course.listPriceInPaise);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group glass flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet/50"
      data-testid="course-card"
    >
      <div className="flex items-center gap-2">
        <Badge tone="violet">{formatLabel(course.format)}</Badge>
        <Badge tone="muted">{audienceLabel(course.audience)}</Badge>
      </div>

      <h3 className="mt-4 font-display text-xl text-text">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm text-text-muted">{course.subtitle}</p>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-text">
            {formatInr(course.priceInPaise)}
          </span>
          {course.listPriceInPaise ? (
            <span className="text-sm text-text-muted line-through">
              {formatInr(course.listPriceInPaise)}
            </span>
          ) : null}
        </div>
        {discount > 0 ? <Badge tone="gold">{discount}% off</Badge> : null}
      </div>

      <span className="mt-4 text-sm font-medium text-violet-bright transition-colors group-hover:text-gold-bright">
        {course.durationWeeks} weeks · View details →
      </span>
    </Link>
  );
}
