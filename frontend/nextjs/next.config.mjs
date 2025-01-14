/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'http',
        hostname: 'gpt.ilanel.co.il',
      },
      {
        protocol: 'http',
        hostname: 'wow.ilanel.co.il',
      },
      {
        protocol: 'https',
        hostname: 'gpt.ilanel.co.il',
      },
      {
        protocol: 'https',
        hostname: 'wow.ilanel.co.il',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  publicRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://gpt.ilanel.co.il,http://localhost:8000',
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://wow.ilanel.co.il,http://localhost:3000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL?.split(',')[0] || 'https://gpt.ilanel.co.il'}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'browsing-topics=(), private-state-token-issuance=(), private-state-token-redemption=()',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias['react-dom$'] = 'react-dom/profiling';
      config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
      Object.assign(config.resolve.alias, {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      });
    }
    return config;
  }
};

export default withPWA(nextConfig);