import type { MetadataRoute } from "next";

// Required for `output: export` so this emits a static robots.txt at build.
export const dynamic = "force-static";

const SITE_URL = "https://glycemicgpt.org";

const isPreview = process.env.NEXT_PUBLIC_BUILD_ENV === "preview";

export default function robots(): MetadataRoute.Robots {
  // Preview builds: keep PR preview hosts out of search indexes entirely.
  if (isPreview) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
