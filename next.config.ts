import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,

  turbopack: {
    root: __dirname,
  },

  async redirects() {
    return [
      {
        source: '/writing/author/marcus-bennett',
        destination: '/writing/author/saad',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
