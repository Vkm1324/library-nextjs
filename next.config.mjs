/** @type {import('next').NextConfig} */
const nextConfig = {
  // runtime: "edge",
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

export default nextConfig;
