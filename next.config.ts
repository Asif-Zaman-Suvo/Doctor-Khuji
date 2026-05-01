import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-pg", "pg", "@prisma/client"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externalsPresets = { ...config.externalsPresets, node: true };
    }
    return config;
  },
};

export default nextConfig;
