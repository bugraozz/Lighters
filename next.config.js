
module.exports = {

  images: {
    domains: ['hediyelistem.com.tr'],
    protocol: 'https',
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