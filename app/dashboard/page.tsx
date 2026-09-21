import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/lib/courses";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface EnrollmentRow {
  course_slug: string;
  created_at: string;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data } = await supabase
    .from("enrollments")
    .select("course_slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const enrollments = (data ?? []) as EnrollmentRow[];
  const name = (user.user_metadata?.full_name as string | undefined) ?? "there";

  async function signOut() {
    "use server";
    const client = await createClient();
    await client.auth.signOut();
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Hi, {name}</h1>
          <p className="mt-1 text-text-muted">Your learning dashboard.</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-full border border-line px-4 py-2 text-sm text-text-muted hover:text-text"
          >
            Sign out
          </button>
        </form>
      </div>

      <h2 className="mt-12 font-display text-2xl">Your programs</h2>
      {enrollments.length === 0 ? (
        <div className="glass mt-4 rounded-2xl p-8 text-center">
          <p className="text-text-muted">
            You haven&apos;t enrolled in anything yet.
          </p>
          <div className="mt-4">
            <ButtonLink href="/courses">Browse courses</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {enrollments.map((row) => {
            const course = getCourseBySlug(row.course_slug);
            return (
              <Link
                key={row.course_slug}
                href={`/courses/${row.course_slug}`}
                className="glass rounded-2xl p-6 transition-colors hover:border-violet/50"
              >
                <Badge tone="violet">Enrolled</Badge>
                <h3 className="mt-3 font-display text-lg">
                  {course?.title ?? row.course_slug}
                </h3>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
