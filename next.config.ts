import type { NextConfig } from "next"
import { imageConfigDefault } from "next/dist/shared/lib/image-config"
import { withSentryConfig } from "@sentry/nextjs/config"

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
    ],
  },
}

export default withSentryConfig(nextConfig, {
  org: "rafli-3e",
  project: "saas-app",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
})
