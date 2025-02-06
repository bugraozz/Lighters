module.exports = {
  // ...existing code...

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hediyelistem.com.tr',
      },
      {
        protocol: 'http',
        hostname: '178.208.187.253',
        port: '3000',
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