import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.genius.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
