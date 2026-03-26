import { createClient } from "@/lib/supabase-server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://onpointtalent.co.nz";
  const supabase = await createClient();
  const { data: jobs } = await supabase.from("jobs").select("id, posted_at");

  const staticRoutes = ["/", "/jobs", "/login", "/signup", "/forgot-password"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const jobRoutes = (jobs ?? []).map((job) => ({
    url: `${base}/jobs/${job.id}`,
    lastModified: new Date(job.posted_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...jobRoutes];
}
