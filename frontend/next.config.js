/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1', port: '8000' },
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'https', hostname: '127.0.0.1', port: '' },
      { protocol: 'https', hostname: 'localhost', port: '' },
      { protocol: 'https', hostname: 'pi4-cf9i.onrender.com', port: '' },
    ],
  },
};

module.exports = nextConfig;
