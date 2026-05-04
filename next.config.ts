import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Firebase App Hosting 배포 시 그대로 사용
  // Firebase Hosting(정적) 배포: NEXT_OUTPUT=export next build
  output: process.env.NEXT_OUTPUT === 'export' ? 'export' : undefined,
};

export default nextConfig;
