const nextConfig = {
    reactStrictMode: false,
    images: {
        // Replaced the deprecated 'domains' with 'remotePatterns'
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'strapi-grocery-shop.onrender.com',
                port: '',
                pathname: '/uploads/**'
            },
        ],
    },
    env: {
        API_URL: process.env.API_URL || 'https://strapi-grocery-shop.onrender.com',
    },
};

export default nextConfig;
