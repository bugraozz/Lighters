
module.exports = {
  // ...existing code...
  images: {
    domains: ['hediyelistem.com.tr'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hediyelistem.com.tr',
        pathname: '/api/uploads/**',
      },
    ],
  },
 
  async rewrites() {
    return [
      {
        source: '/api/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
}