"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import type { Audience, Course } from "@/lib/types";
import { CourseCard } from "./CourseCard";

type Filter = Audience;

const TABS: { value: Filter; label: string }[] = [
  { value: "both", label: "All" },
  { value: "mba", label: "MBA" },
  { value: "engineering", label: "Engineering" },
];

/** Returns courses matching the selected audience filter. */
export function filterCourses(courses: Course[], filter: Filter): Course[] {
  if (filter === "both") {
    return courses;
  }
  return courses.filter(
    (c) => c.audience === filter || c.audience === "both",
  );
}

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<Filter>("both");
  const visible = useMemo(() => filterCourses(courses, filter), [courses, filter]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter courses by audience"
        className="flex flex-wrap gap-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={filter === tab.value}
            onClick={() => setFilter(tab.value)}
            className={clsx(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              filter === tab.value
                ? "bg-violet text-white"
                : "border border-line text-text-muted hover:text-text",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-text-muted">
          No courses for this track yet — check back soon.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
