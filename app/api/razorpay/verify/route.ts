import { NextResponse } from "next/server";
import { checkoutVerifySchema } from "@/lib/validation";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkoutVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Payments are not configured" },
      { status: 500 },
    );
  }

  const valid = verifyPaymentSignature({
    orderId: parsed.data.razorpay_order_id,
    paymentId: parsed.data.razorpay_payment_id,
    signature: parsed.data.razorpay_signature,
    secret,
  });
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { error } = await supabase.from("enrollments").insert({
    user_id: user.id,
    course_slug: parsed.data.courseSlug,
    payment_id: parsed.data.razorpay_payment_id,
    order_id: parsed.data.razorpay_order_id,
  });
  if (error) {
    return NextResponse.json(
      { error: "Could not record enrollment" },
      { status: 500 },
    );
  }

  return NextResponse.json({ verified: true });
}
