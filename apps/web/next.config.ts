import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // o pacote do monorepo é consumido como TypeScript puro
  transpilePackages: ['@acervo/core'],
};

export default nextConfig;
