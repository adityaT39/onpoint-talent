import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { type, employer_id, job_id } = session.metadata ?? {};

      if (type === "per_listing" && employer_id && job_id) {
        await admin.from("job_unlocks").upsert(
          {
            employer_id,
            job_id,
            stripe_payment_intent_id: session.payment_intent as string,
            unlocked_at: new Date().toISOString(),
          },
          { onConflict: "employer_id,job_id" }
        );
      }

      if (type === "pro" && session.subscription && employer_id) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await admin.from("employer_subscriptions").upsert(
          {
            employer_id,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: sub.id,
            status: sub.status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "employer_id" }
        );
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await admin.from("employer_subscriptions").upsert(
          {
            employer_id: profile.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: sub.id,
            status: sub.status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "employer_id" }
        );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
