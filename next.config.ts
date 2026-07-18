import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the "X-Powered-By: Next.js" header (minor tech disclosure).
  poweredByHeader: false,
};

export default nextConfig;
