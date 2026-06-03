import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  async rewrites() {
    const defaultBackendUrl =
      process.env.NODE_ENV === "production"
        ? "https://medibook-backend-8uzh.onrender.com"
        : "http://localhost:5000";
    const backendUrl =
      process.env.BACKEND_URL ||
      (process.env.BACKEND_HOSTPORT ? `http://${process.env.BACKEND_HOSTPORT}` : undefined) ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      defaultBackendUrl;

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
