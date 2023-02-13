// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

const { withSuperjson } = require('next-superjson')

/** @type {import('next').NextConfig} */
const config = {
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  // images: {
  //   domains: [],
  // },
  async rewrites() {
    return [
      // {
      //   source: '/api/v1/:path*',
      //   destination: `${process.env.BACKEND_URL}/api/v1/:path*`
      // }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/explore',
        permanent: true
      }
    ]
  },
  sassOptions: {
    includePaths: ['./src'],
    prependData: `@import "./src/styles/vars.scss";`,
  },
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  },
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'sameorigin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), camera=(), microphone=()',
          },
          {
            key: 'X-Powered-By',
            value: 'Sven Huepers',
          }
        ]
      }
    ]
  }
}

module.exports = withSuperjson()(config);

module.exports = withSentryConfig(
  module.exports,
  { silent: true },
  { hideSourceMaps: true },
);
