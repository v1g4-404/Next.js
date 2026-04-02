/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "anuawwmdtrcvgwwhvdfj.supabase.co",
      },
    ],
  },
};

export default nextConfig;