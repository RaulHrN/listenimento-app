import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // o pacote do monorepo é consumido como TypeScript puro
  transpilePackages: ['@listenimento/core'],
};

export default nextConfig;
