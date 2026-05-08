/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    domains: [
      "localhost",
      "images.unsplash.com",
      "storage.googleapis.com",
      "youtube.com",
      "https://perfect-man-hub.vercel.app",
    ],
    unoptimized: true,
  },
};

export default nextConfig;
