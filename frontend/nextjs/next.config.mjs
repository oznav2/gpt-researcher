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
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_CX_KEY: process.env.GOOGLE_CX_KEY,
    BING_API_KEY: process.env.BING_API_KEY,
    SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,
    SERPER_API_KEY: process.env.SERPER_API_KEY,
    LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY,
    SEARCHAPI_API_KEY: process.env.SEARCHAPI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    NCBI_API_KEY: process.env.NCBI_API_KEY,
    EXA_API_KEY: process.env.EXA_API_KEY,
    LANGCHAIN_TRACING_V2: process.env.LANGCHAIN_TRACING_V2,
    DOC_PATH: process.env.DOC_PATH,
    RETRIEVER: process.env.RETRIEVER,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SEARX_URL: process.env.SEARX_URL,
    EMBEDDING_MODEL: process.env.OPENAI_EMBEDDING_MODEL,
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
  },
};

export default withPWA(nextConfig);