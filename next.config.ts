import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable instrumentation for database initialization on server start
  experimental: {
    instrumentationHook: true,
  },
  // External packages that should not be bundled
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
