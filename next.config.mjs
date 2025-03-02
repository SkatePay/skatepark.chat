/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    },
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "skateconnect.s3.us-west-2.amazonaws.com",
            pathname: "/**",
          },
        ],
    },
};

export default nextConfig;
