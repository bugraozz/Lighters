
module.exports = {
  // ...existing code...
  images: {
    domains: ['via.placeholder.com'],
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