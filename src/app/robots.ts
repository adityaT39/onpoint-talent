import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/login", "/signup", "/forgot-password"],
        disallow: ["/employer", "/dashboard", "/profile", "/verify-email", "/reset-password", "/post-job"],
      },
    ],
    sitemap: "https://onpointtalent.co.nz/sitemap.xml",
  };
}
