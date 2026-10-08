import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    // The preserved research contract uses Node-style .js specifiers for TS sources.
    resolveAlias: { "./species.schema.js": "./data/schemas/species.schema.ts" },
  },
  // Separate dev/build output allows local development to remain running during a build.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default config;
