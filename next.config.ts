import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Date-specific scorecard → latest (static build only pre-renders /latest)
      {
        source: "/scorecard/:date(\\d{4}-\\d{2}-\\d{2})",
        destination: "/scorecard/latest",
        permanent: false,
      },
      // Date-specific daily → latest (static build only pre-renders /latest/:rep)
      {
        source: "/daily/:date(\\d{4}-\\d{2}-\\d{2})/:rep",
        destination: "/daily/latest/:rep",
        permanent: false,
      },
    ];
  },
};

export default config;
