import { Hero3D } from "@/components/three/Hero3D";
import { CourseCard } from "@/components/CourseCard";
import { LiveClassCard } from "@/components/LiveClassCard";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getFeaturedCourses } from "@/lib/courses";
import { getUpcomingLiveClasses } from "@/lib/liveClasses";

const steps = [
  {
    title: "Find your target",
    body: "A clarity session maps where you are and the exact role or company you want to switch into.",
  },
  {
    title: "Close the gap",
    body: "Live cohorts and courses built around the skills that role actually screens for.",
  },
  {
    title: "Land the switch",
    body: "Mock interviews, portfolio reviews and mentor accountability until you get the offer.",
  },
];

export default function HomePage() {
  const featured = getFeaturedCourses();
  const liveClasses = getUpcomingLiveClasses().slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-float-in">
            <Badge tone="gold">For MBA &amp; engineering students</Badge>
            <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
              <span className="text-gradient">Switch roles.</span>
              <br />
              Switch companies. <br />
              With a plan.
            </h1>
            <p className="mt-5 max-w-md text-lg text-text-muted">
              Live classes, curated courses and 1:1 mentorship that give you
              clarity on your career path, and the skills to get there.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/courses" size="lg">
                Explore courses
              </ButtonLink>
              <ButtonLink href="/signup" size="lg" variant="ghost">
                Start free
              </ButtonLink>
            </div>
          </div>
          <div className="h-[360px] md:h-[460px]">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="glass rounded-2xl p-6">
              <div className="font-display text-3xl text-violet-bright">
                0{i + 1}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">Featured programs</h2>
          <ButtonLink href="/courses" variant="ghost" size="sm">
            View all
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      {/* Live classes */}
      <section id="mentors" className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">Upcoming live classes</h2>
          <ButtonLink href="/live-classes" variant="ghost" size="sm">
            See schedule
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liveClasses.map((lc) => (
            <LiveClassCard key={lc.id} liveClass={lc} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="glass flex flex-col items-center gap-5 rounded-2xl px-6 py-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl">
            Ready to make your next move?
          </h2>
          <p className="max-w-md text-text-muted">
            Join a cohort of ambitious students and mentors who&apos;ve done the
            switch you&apos;re planning.
          </p>
          <ButtonLink href="/signup" size="lg">
            Create your free account
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
