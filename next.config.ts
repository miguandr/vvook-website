import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["192.168.178.82"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
			},
		],
	},
};

export default nextConfig;
