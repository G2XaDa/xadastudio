import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The xada-shop case study was replaced by Evans Custom Homes.
      {
        source: "/work/xada-shop",
        destination: "/work/evans-custom-home",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
