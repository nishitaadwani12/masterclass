import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { orderSchema } from "@/lib/validation";
import { getCourseBySlug } from "@/lib/courses";
import { priceWithGst } from "@/lib/pricing";
import { buildReceipt } from "@/lib/razorpay";
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

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const course = getCourseBySlug(parsed.data.courseSlug);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payments are not configured" },
      { status: 500 },
    );
  }

  const amount = priceWithGst(course.priceInPaise);

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: buildReceipt(course.slug),
      notes: { courseSlug: course.slug, userId: user.id },
    });

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? keyId,
      courseTitle: course.title,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 502 },
    );
  }
}
