import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [60, 75, 100],
  },
  /* config options here */
};

export default nextConfig;
