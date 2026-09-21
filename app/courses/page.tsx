import type { Metadata } from "next";
import { CourseCatalog } from "@/components/CourseCatalog";
import { getAllCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses | SwitchPath",
  description: "Live cohorts, courses and mentorship for role and company switches.",
};

export default function CoursesPage() {
  const courses = getAllCourses();
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-4xl">Programs built for the switch</h1>
      <p className="mt-3 max-w-xl text-text-muted">
        Whether you&apos;re moving into product, cracking SDE interviews or
        pivoting to strategy, pick a track and get a clear plan.
      </p>
      <div className="mt-10">
        <CourseCatalog courses={courses} />
      </div>
    </div>
  );
}
