
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Skip ESLint errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Skip TypeScript type-checking errors during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
