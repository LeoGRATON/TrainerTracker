import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Optimise le déploiement
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
