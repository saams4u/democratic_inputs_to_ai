/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["upload.wikimedia.org"]
    },
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: 'https://democratic-inputs-to-ai-3bv6.vercel.app' },
          ],
        },
      ];
    },
};

module.exports = nextConfig