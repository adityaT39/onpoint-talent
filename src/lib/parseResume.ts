import * as pdfjsLib from "pdfjs-dist";
import { extractSkills } from "./extractSkills";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/** Extract raw text from a PDF File, preserving line breaks for better AI parsing */
export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const lines: { y: number; text: string }[] = [];
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const y = Math.round((item as { transform: number[] }).transform[5]);
      const existing = lines.find((l) => Math.abs(l.y - y) < 3);
      if (existing) {
        existing.text += " " + item.str;
      } else {
        lines.push({ y, text: item.str });
      }
    }

    // Sort top-to-bottom (higher y = higher on page in PDF coords)
    lines.sort((a, b) => b.y - a.y);
    pageTexts.push(lines.map((l) => l.text.trim()).join("\n"));
  }

  return pageTexts.join("\n\n");
}

/** Best-effort extraction of structured fields from raw resume text */
export function extractProfileFields(text: string): {
  phone: string;
  location: string;
  skills: string[];
} {
  const phoneMatch = text.match(/(\+?[\d][\d\s\-().]{6,}[\d])/);
  const locationMatch = text.match(
    /([A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+){0,3}(?:,\s*(?:BC|AB|ON|QC|NZ|AU|USA|UK|Canada|New Zealand|Australia))?)/
  );
  return {
    phone: phoneMatch ? phoneMatch[1].trim() : "",
    location: locationMatch ? locationMatch[1].trim() : "",
    skills: extractSkills(text),
  };
}
