import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import type { WorkExperience, Education } from "@/types";

export type ParseResumeResult = {
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
};

const SYSTEM_PROMPT = `You are a resume parser. Extract structured profile data from raw resume text.

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no code fences, no explanation.

The JSON must have exactly these keys:
{
  "phone": "phone number or empty string",
  "location": "city/region or empty string",
  "summary": "2–4 sentence professional summary in third person, or empty string",
  "skills": ["array of skill strings"],
  "experience": [
    {
      "role": "job title",
      "company": "employer name",
      "duration": "date range e.g. Jan 2021 – Mar 2023",
      "description": "1–3 sentences of key responsibilities"
    }
  ],
  "education": [
    {
      "degree": "degree or certification name",
      "institution": "school or institution name",
      "year": "graduation year or date range e.g. 2018–2022"
    }
  ]
}

Rules:
- Use empty string or empty array when a field cannot be determined.
- List experience and education in reverse chronological order.
- Do NOT invent information not present in the resume.
- Return ONLY the JSON object.`;

const EMPTY_RESULT: ParseResumeResult = {
  phone: "", location: "", summary: "", skills: [], experience: [], education: [],
};

function isValidWorkExperience(item: unknown): item is WorkExperience {
  if (typeof item !== "object" || item === null) return false;
  const o = item as Record<string, unknown>;
  return (
    typeof o.role === "string" && typeof o.company === "string" &&
    typeof o.duration === "string" && typeof o.description === "string"
  );
}

function isValidEducation(item: unknown): item is Education {
  if (typeof item !== "object" || item === null) return false;
  const o = item as Record<string, unknown>;
  return typeof o.degree === "string" && typeof o.institution === "string" && typeof o.year === "string";
}

function parseSafeJson(raw: string): ParseResumeResult {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  let parsed: unknown;
  try { parsed = JSON.parse(cleaned); } catch { return EMPTY_RESULT; }
  if (typeof parsed !== "object" || parsed === null) return EMPTY_RESULT;
  const o = parsed as Record<string, unknown>;
  return {
    phone: typeof o.phone === "string" ? o.phone.trim() : "",
    location: typeof o.location === "string" ? o.location.trim() : "",
    summary: typeof o.summary === "string" ? o.summary.trim() : "",
    skills: Array.isArray(o.skills)
      ? (o.skills as unknown[]).filter((s): s is string => typeof s === "string").map(s => s.trim()).filter(Boolean)
      : [],
    experience: Array.isArray(o.experience)
      ? (o.experience as unknown[]).filter(isValidWorkExperience)
      : [],
    education: Array.isArray(o.education)
      ? (o.education as unknown[]).filter(isValidEducation)
      : [],
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "seeker") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const text: string = typeof body.text === "string" ? body.text.slice(0, 40_000) : "";
    if (!text.trim()) return NextResponse.json(EMPTY_RESULT);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json(EMPTY_RESULT, { status: 500 });

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Extract structured profile data from this resume:\n\n${text}` }],
    });

    const rawText = message.content[0]?.type === "text" ? message.content[0].text : "";
    return NextResponse.json(parseSafeJson(rawText));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = (err as { status?: number }).status;
    console.error(`[parse-resume] error (status=${status}): ${msg}`);
    return NextResponse.json(EMPTY_RESULT, { status: 500 });
  }
}
