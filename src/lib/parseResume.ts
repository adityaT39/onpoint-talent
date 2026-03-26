import * as pdfjsLib from "pdfjs-dist";
import { extractSkills } from "./extractSkills";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/** Extract raw text from a PDF File */
export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, (_, i) =>
      pdf.getPage(i + 1).then((p) => p.getTextContent())
    )
  );
  return pages
    .flatMap((page) => page.items.map((item) => ("str" in item ? item.str : "")))
    .join(" ");
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
