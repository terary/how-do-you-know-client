/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
      {
        source: '/exam-templates/:id/preview',
        destination: 'http://localhost:3001/exam-templates/:id/preview',
      },
      {
        source: '/exam-templates/sections/:sectionId/questions/bulk',
        destination: 'http://localhost:3001/exam-templates/sections/:sectionId/questions/bulk',
      },
      {
        source: '/exam-templates/:id/sections',
        has: [
          {
            type: 'query',
            key: 'api',
            value: 'true',
          },
        ],
        destination: 'http://localhost:3001/exam-templates/:id/sections',
      },
    ];
  },
};

export default nextConfig;
