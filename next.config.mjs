/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // The background video/poster are large and rarely change; let browsers reuse them on
        // repeat visits instead of revalidating before playback (Vercel's default is max-age=0).
        source: "/:file(background\\.mp4|background-poster\\.jpg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
