import type { MetadataRoute } from "next";

// Required for `output: export` so this emits a static sitemap.xml at build.
export const dynamic = "force-static";

const SITE_URL = "https://glycemicgpt.org";

// Preview builds (pr-*.glycemicgpt.pages.dev) already emit a noindex meta tag
// in the root layout; they must not advertise an indexable sitemap.
const isPreview = process.env.NEXT_PUBLIC_BUILD_ENV === "preview";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];

  const routes = [
    "",
    "/docs",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/accessibility",
    "/contact",
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
  }));
}
