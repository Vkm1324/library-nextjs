import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        // pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        port: "",
        // pathname: "/account123/**",
      },
    ],
  },

  experimental: {
    ppr: "incremental",
  },
};

export default withNextIntl(nextConfig);
