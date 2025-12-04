import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

export default withSerwist({
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {},
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.buymeacoffee.com",
        pathname: "/buttons/v2/default-yellow.png",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  output: "standalone",
});
