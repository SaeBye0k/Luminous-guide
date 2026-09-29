import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  devIndicators: false,
  images: { unoptimized: true },
  basePath: process.env.PAGES_BASE_PATH || "",
  assetPrefix: process.env.PAGES_BASE_PATH || "",
};

export default nextConfig;
