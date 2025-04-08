import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      },
    ],
  },
  output: "standalone",
  experimental: {
    // Enables experimental authInterrupts to handle 401 and 403 errors using Next.js APIs
    // (e.g., unauthorized() and forbidden()). This feature allows automatic routing to custom
    // error pages, reducing manual handling of auth errors. Note that as an experimental API,
    // its behavior may change in future releases.
    authInterrupts: true,
  },
};

export default nextConfig;
