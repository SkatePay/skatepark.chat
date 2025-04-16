/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_CHANNEL_ID: process.env.NEXT_PUBLIC_CHANNEL_ID,
    NEXT_PUBLIC_DOWNLOAD_URL: process.env.NEXT_PUBLIC_DOWNLOAD_URL,
    NEXT_RABOTA_URL: process.env.NEXT_RABOTA_URL,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'skateconnect.s3.us-west-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
