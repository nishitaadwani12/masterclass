import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    audience: z.enum(["mba", "engineering"], {
      errorMap: () => ({ message: "Select your background" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const orderSchema = z.object({
  courseSlug: z.string().min(1, "courseSlug is required"),
});

export const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

/**
 * Runs a Zod schema and returns a flat field->message map, or null when valid.
 * Keeps form components free of Zod plumbing.
 */
export function fieldErrors<T>(
  schema: z.ZodType<T>,
  data: unknown,
): Record<string, string> | null {
  const result = schema.safeParse(data);
  if (result.success) {
    return null;
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "form";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
