
module.exports = {
  

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hediyelistem.com.tr',
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