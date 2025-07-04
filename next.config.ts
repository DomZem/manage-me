import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: '/api/(.*)',
				headers: [
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true',
					},
				],
			},
		];
	},
};

export default nextConfig;
