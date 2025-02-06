
module.exports = {

  images: {
    domains: ['hediyelistem.com.tr'],
    
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