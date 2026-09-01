/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so this deploys identically to GitHub Pages and Vercel.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};
export default nextConfig;
