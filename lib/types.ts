export type Audience = "mba" | "engineering" | "both";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseFormat = "self-paced" | "live-cohort" | "mentorship";

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  audience: Audience;
  level: CourseLevel;
  format: CourseFormat;
  /** Duration in weeks. */
  durationWeeks: number;
  /** Price in paise (INR * 100). Finalised later — placeholders for now. */
  priceInPaise: number;
  /** Original/list price in paise, for showing a discount. Optional. */
  listPriceInPaise?: number;
  outcomes: string[];
  modules: CourseModule[];
  featured?: boolean;
}

export interface LiveClass {
  id: string;
  title: string;
  mentor: string;
  audience: Audience;
  /** ISO 8601 start time. */
  startsAt: string;
  durationMinutes: number;
  seatsTotal: number;
  seatsTaken: number;
}

export interface RazorpayOrderInput {
  courseSlug: string;
}

export interface RazorpayVerifyInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
