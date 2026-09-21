import type { Audience, Course } from "./types";

/**
 * Course catalogue. Prices are placeholders (in paise) to be finalised later.
 * Kept as typed data so the whole app + tests work today; can be migrated to
 * a Supabase table without changing the query helpers below.
 */
export const COURSES: Course[] = [
  {
    slug: "product-management-transition",
    title: "Product Management Transition",
    subtitle: "From engineer or analyst to PM — the structured way.",
    description:
      "A live cohort that takes you from your current role into product management: frameworks, artefacts, mock interviews and a portfolio project reviewed by working PMs.",
    audience: "both",
    level: "intermediate",
    format: "live-cohort",
    durationWeeks: 8,
    priceInPaise: 4999900,
    listPriceInPaise: 7499900,
    outcomes: [
      "Build a PRD and product portfolio from scratch",
      "Crack product-sense and execution interviews",
      "Map a 90-day switching plan for your target companies",
    ],
    modules: [
      {
        title: "Foundations of Product Thinking",
        lessons: ["The PM role across company stages", "User problems vs. solutions", "Metrics that matter"],
      },
      {
        title: "Execution & Interviews",
        lessons: ["Writing a crisp PRD", "Prioritisation frameworks", "Mock interview clinic"],
      },
    ],
    featured: true,
  },
  {
    slug: "sde-interview-mastery",
    title: "SDE Interview Mastery",
    subtitle: "Switch to a top product company as a software engineer.",
    description:
      "DSA patterns, system design and behavioural rounds, tuned for engineers targeting a role or company switch. Weekly live problem-solving with senior engineers.",
    audience: "engineering",
    level: "advanced",
    format: "live-cohort",
    durationWeeks: 12,
    priceInPaise: 5999900,
    listPriceInPaise: 8999900,
    outcomes: [
      "Pattern-based approach to 250+ DSA problems",
      "Design scalable systems in a 45-minute round",
      "Negotiate a level-appropriate offer",
    ],
    modules: [
      {
        title: "Data Structures & Algorithms",
        lessons: ["Arrays, hashing & two pointers", "Graphs & trees", "Dynamic programming patterns"],
      },
      {
        title: "System Design",
        lessons: ["Scaling fundamentals", "Designing real systems", "The behavioural round"],
      },
    ],
    featured: true,
  },
  {
    slug: "consulting-case-prep",
    title: "Consulting & Strategy Case Prep",
    subtitle: "For MBAs targeting strategy and consulting roles.",
    description:
      "Structured case-cracking, guesstimates and fit interviews for MBA students moving into consulting or corporate strategy. Peer case practice plus mentor feedback.",
    audience: "mba",
    level: "intermediate",
    format: "live-cohort",
    durationWeeks: 6,
    priceInPaise: 4499900,
    outcomes: [
      "Structure any case in under a minute",
      "Nail guesstimates and market sizing",
      "Tell a compelling fit-interview story",
    ],
    modules: [
      {
        title: "Case Frameworks",
        lessons: ["Profitability & market entry", "Guesstimates", "Mergers & pricing"],
      },
      {
        title: "Fit & Delivery",
        lessons: ["Personal impact stories", "Live case clinic"],
      },
    ],
  },
  {
    slug: "career-clarity-1on1",
    title: "1:1 Career Clarity Mentorship",
    subtitle: "Not sure what to switch to? Start here.",
    description:
      "Personal mentorship to map your next role: skills-gap analysis, a target-company shortlist and a week-by-week action plan tailored to you.",
    audience: "both",
    level: "beginner",
    format: "mentorship",
    durationWeeks: 4,
    priceInPaise: 1999900,
    listPriceInPaise: 2999900,
    outcomes: [
      "A clear target role and company shortlist",
      "A personalised skills-gap roadmap",
      "Accountability check-ins with a mentor",
    ],
    modules: [
      {
        title: "Discover",
        lessons: ["Strengths & motivations audit", "Role landscape mapping"],
      },
      {
        title: "Plan",
        lessons: ["Skills-gap roadmap", "30-60-90 day plan"],
      },
    ],
  },
];

export function getAllCourses(): Course[] {
  return COURSES;
}

export function getFeaturedCourses(): Course[] {
  return COURSES.filter((course) => course.featured);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}

/** Filters by audience; "both" courses always match a specific audience. */
export function getCoursesByAudience(audience: Audience): Course[] {
  if (audience === "both") {
    return COURSES;
  }
  return COURSES.filter(
    (course) => course.audience === audience || course.audience === "both",
  );
}
