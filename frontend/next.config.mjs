import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  webpack(config) {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.join(process.cwd(), "node_modules")
    ];

    return config;
  }
};

export default nextConfig;
