/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint hatalarını görmezden gel (derleme sırasında)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript hatalarını görmezden gel (derleme sırasında)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
