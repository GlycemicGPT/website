import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  output: "export",
  // Emit each route as <slug>/index.html so URLs end with a trailing slash.
  // Without this, relative markdown links like ./foo from /docs/platform
  // resolve to /docs/foo (browser treats "platform" as a filename) and 404.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withMDX(nextConfig);
