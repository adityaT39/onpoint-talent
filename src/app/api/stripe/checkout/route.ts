import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("name, role, stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "employer") {
    return NextResponse.json({ error: "Employer account required" }, { status: 403 });
  }

  const { type, jobId } = (await req.json()) as {
    type: "per_listing" | "pro";
    jobId?: string;
  };

  if (type !== "per_listing" && type !== "pro") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (type === "per_listing" && !jobId) {
    return NextResponse.json({ error: "jobId required for per_listing" }, { status: 400 });
  }

  // Get or create Stripe customer
  let customerId: string = profile.stripe_customer_id ?? "";
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: profile.name,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await admin
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const successUrl =
    type === "per_listing"
      ? `${origin}/employer/jobs/${jobId}?payment=success`
      : `${origin}/employer?payment=success`;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: type === "pro" ? "subscription" : "payment",
    line_items: [
      {
        price:
          type === "pro"
            ? process.env.STRIPE_PRO_PRICE_ID!
            : process.env.STRIPE_PER_LISTING_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      type,
      employer_id: user.id,
      job_id: jobId ?? "",
    },
    success_url: successUrl,
    cancel_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
