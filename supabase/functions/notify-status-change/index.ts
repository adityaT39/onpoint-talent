/**
 * Supabase Edge Function: notify-status-change
 *
 * Triggered by a Supabase Database Webhook on the `applications` table
 * (UPDATE events only). Sends an email via Resend when an employer moves
 * an application to "interview" or "rejected".
 *
 * Required environment variables (set in Supabase Dashboard → Edge Functions → Secrets):
 *   RESEND_API_KEY   — your Resend API key (https://resend.com)
 *   FROM_EMAIL       — verified sender address, e.g. "noreply@yourdomain.com"
 *   APP_URL          — public URL of your app, e.g. "https://onpoint-talent.vercel.app"
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: ApplicationRow;
  old_record: ApplicationRow | null;
}

interface ApplicationRow {
  id: string;
  job_id: string;
  seeker_id: string;
  seeker_name: string;
  seeker_email: string;
  status: "pending" | "interview" | "rejected";
  applied_at: string;
  employer_id: string | null;
}

const STATUS_COPY: Record<string, { subject: string; heading: string; body: string; color: string }> = {
  interview: {
    subject: "Great news — you've been shortlisted for an interview!",
    heading: "You've been shortlisted! 🎉",
    body: "Congratulations! The employer has reviewed your application and would like to invite you for an interview. Check your dashboard for details and next steps.",
    color: "#2563eb",
  },
  rejected: {
    subject: "An update on your application",
    heading: "Application update",
    body: "Thank you for your interest. After careful consideration, the employer has decided to move forward with other candidates at this time. We encourage you to keep applying — the right opportunity is out there.",
    color: "#64748b",
  },
};

serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();

    // Only handle UPDATE events on the applications table
    if (payload.type !== "UPDATE" || payload.table !== "applications") {
      return new Response("ignored", { status: 200 });
    }

    const { record, old_record } = payload;

    // Only fire when status actually changed to interview or rejected
    if (!old_record || record.status === old_record.status) {
      return new Response("no status change", { status: 200 });
    }
    if (record.status !== "interview" && record.status !== "rejected") {
      return new Response("status not notifiable", { status: 200 });
    }

    const copy = STATUS_COPY[record.status];
    const appUrl = Deno.env.get("APP_URL") ?? "";
    const fromEmail = Deno.env.get("FROM_EMAIL") ?? "noreply@example.com";
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (!resendKey) {
      console.error("RESEND_API_KEY not set");
      return new Response("missing env", { status: 500 });
    }

    // Fetch job title from Supabase (using service role via internal API)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    let jobTitle = "your applied position";

    if (supabaseUrl && supabaseServiceKey) {
      const jobRes = await fetch(
        `${supabaseUrl}/rest/v1/jobs?id=eq.${record.job_id}&select=title`,
        {
          headers: {
            apikey: supabaseServiceKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
          },
        }
      );
      if (jobRes.ok) {
        const jobs = await jobRes.json();
        if (jobs[0]?.title) jobTitle = jobs[0].title;
      }
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${copy.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

          <!-- Header bar -->
          <tr>
            <td style="background:${copy.color};padding:24px 32px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                OnPoint Talent
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
                ${copy.heading}
              </h1>
              <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.6;">
                Hi ${record.seeker_name || "there"},
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.6;">
                ${copy.body}
              </p>

              <!-- Job pill -->
              <div style="background:#f1f5f9;border-radius:10px;padding:14px 18px;margin:0 0 24px;">
                <p style="margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;">
                  Applied position
                </p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#0f172a;">
                  ${jobTitle}
                </p>
              </div>

              <!-- CTA -->
              <a href="${appUrl}/seeker"
                style="display:inline-block;padding:12px 28px;background:${copy.color};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:999px;">
                View My Applications
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                You received this email because you applied for a job through OnPoint Talent.<br />
                If this wasn't you, please <a href="${appUrl}" style="color:#2563eb;">contact us</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `OnPoint Talent <${fromEmail}>`,
        to: [record.seeker_email],
        subject: `${copy.subject} — ${jobTitle}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend error:", err);
      return new Response("email failed", { status: 500 });
    }

    console.log(`Notified ${record.seeker_email} — status: ${record.status}`);
    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response("error", { status: 500 });
  }
});
