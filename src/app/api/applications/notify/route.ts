import { Resend } from "resend";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type NotifyBody = {
  type: "interview" | "rejected";
  seekerEmail: string;
  seekerName: string;
  jobTitle: string;
  company: string;
};

export async function POST(request: NextRequest) {
  try {
    // Auth gate — must be a signed-in employer
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (toSet) =>
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            ),
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "employer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: NotifyBody = await request.json();
    const { type, seekerEmail, seekerName, jobTitle, company } = body;

    if (!type || !seekerEmail || !seekerName || !jobTitle || !company) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[notify] RESEND_API_KEY is not set");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const subject =
      type === "interview"
        ? `Interview Invitation – ${jobTitle} at ${company}`
        : `Your application for ${jobTitle} at ${company}`;

    const html =
      type === "interview"
        ? `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
            <h2 style="color:#2563eb">Great news, ${seekerName}!</h2>
            <p><strong>${company}</strong> has reviewed your application for <strong>${jobTitle}</strong> and would like to invite you to an interview.</p>
            <p>The team will be in touch shortly with scheduling details. Best of luck!</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
            <p style="font-size:12px;color:#94a3b8">You're receiving this because you applied on OnPoint Talent.</p>
          </div>
        `
        : `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
            <h2>Hi ${seekerName},</h2>
            <p>Thank you for your interest in <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>
            <p>After careful consideration, we've decided to move forward with other candidates at this time. We truly appreciate the time and effort you put into your application and wish you all the best in your search.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
            <p style="font-size:12px;color:#94a3b8">You're receiving this because you applied on OnPoint Talent.</p>
          </div>
        `;

    await resend.emails.send({
      from: "OnPoint Talent <onboarding@resend.dev>",
      to: seekerEmail,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notify] Error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
