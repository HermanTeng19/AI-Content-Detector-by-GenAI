/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimizes for production deployment
  poweredByHeader: false, // Removes the X-Powered-By header
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.imgur.com'], // Add domains for any external images you might use
  }
};

export default nextConfig;
