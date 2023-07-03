/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
      domains: ["upload.wikimedia.org"]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { 
            key: "Access-Control-Allow-Credentials", value: "true" 
          },
          { 
            key: 'Access-Control-Allow-Origin', 
            value: 'https://democratic-inputs-to-ai-3bv6.vercel.app' 
          },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET,POST,PUT,DELETE,OPTIONS' 
          },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: "Content-Type, Authorization",
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig