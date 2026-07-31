import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keeps client-side navigations to dynamic routes (our list pages read
    // cookies for auth, which makes them dynamic) in the Router Cache for a
    // few minutes: revisiting a tab is instant, then revalidates in the
    // background instead of re-fetching on every navigation.
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
  },
};

export default nextConfig;
