# notify-status-change — Setup Guide

## What it does
Sends an email to the seeker when an employer changes their application status to **Interview** or **Rejected**.

---

## 1. Deploy the Edge Function

```bash
supabase functions deploy notify-status-change
```

---

## 2. Set environment secrets

In Supabase Dashboard → **Edge Functions** → **notify-status-change** → **Secrets**, add:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Your Resend API key (get one at resend.com — free tier works) |
| `FROM_EMAIL` | A verified sender email, e.g. `noreply@yourdomain.com` |
| `APP_URL` | Your app's public URL, e.g. `https://onpoint-talent.vercel.app` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by Supabase.

---

## 3. Create the Database Webhook

In Supabase Dashboard → **Database** → **Webhooks** → **Create a new hook**:

| Field | Value |
|-------|-------|
| Name | `on_application_status_change` |
| Table | `public.applications` |
| Events | ✅ Update |
| Type | **Supabase Edge Functions** |
| Edge Function | `notify-status-change` |

No additional HTTP headers needed (Supabase injects the auth automatically).

---

## 4. Verify Resend domain (for production)

For production, verify your sending domain in Resend to avoid emails landing in spam.
For local testing, Resend's sandbox mode works with any `from` address.

---

## Email content

- **Interview**: "Great news — you've been shortlisted!" (blue header)
- **Rejected**: "An update on your application" (slate header, warm tone)

Both emails include the job title and a CTA button to the seeker dashboard.
