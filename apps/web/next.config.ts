import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // o pacote do monorepo é consumido como TypeScript puro
  transpilePackages: ['@acervo/core'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'media.rawg.io' },
      { protocol: 'https', hostname: 'books.google.com' },
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: '*.dzcdn.net' },
    ],
  },
};

export default nextConfig;
