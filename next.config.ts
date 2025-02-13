import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com`,
      },
    ],
  },
};

export default nextConfig;
