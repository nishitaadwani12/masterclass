import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/courses";
import { formatInr, discountPercent, priceWithGst } from "@/lib/pricing";
import { audienceLabel, formatLabel } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { CheckoutButton } from "@/components/CheckoutButton";

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) {
    return { title: "Course not found | Masterclass" };
  }
  return { title: `${course.title} | Masterclass`, description: course.subtitle };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  const discount = discountPercent(course.priceInPaise, course.listPriceInPaise);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="violet">{formatLabel(course.format)}</Badge>
        <Badge tone="muted">{audienceLabel(course.audience)}</Badge>
        <Badge tone="muted">{course.durationWeeks} weeks</Badge>
      </div>

      <h1 className="mt-4 font-display text-4xl">{course.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-text-muted">{course.subtitle}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <p className="text-text-muted">{course.description}</p>

          <h2 className="mt-10 font-display text-2xl">What you&apos;ll achieve</h2>
          <ul className="mt-4 space-y-2">
            {course.outcomes.map((o) => (
              <li key={o} className="flex gap-2 text-text-muted">
                <span className="text-gold-bright">✦</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-2xl">Curriculum</h2>
          <div className="mt-4 space-y-4">
            {course.modules.map((m, i) => (
              <div key={m.title} className="glass rounded-2xl p-5">
                <h3 className="font-semibold">
                  <span className="text-violet-bright">Module {i + 1}.</span>{" "}
                  {m.title}
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-text-muted">
                  {m.lessons.map((lesson) => (
                    <li key={lesson}>· {lesson}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit md:sticky md:top-24">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">
                {formatInr(course.priceInPaise)}
              </span>
              {course.listPriceInPaise ? (
                <span className="text-text-muted line-through">
                  {formatInr(course.listPriceInPaise)}
                </span>
              ) : null}
            </div>
            {discount > 0 ? (
              <div className="mt-2">
                <Badge tone="gold">Save {discount}%</Badge>
              </div>
            ) : null}
            <p className="mt-2 text-xs text-text-muted">
              {formatInr(priceWithGst(course.priceInPaise))} incl. 18% GST
            </p>
            <div className="mt-5">
              <CheckoutButton course={course} />
            </div>
            <p className="mt-3 text-center text-xs text-text-muted">
              Secure payments via Razorpay
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
