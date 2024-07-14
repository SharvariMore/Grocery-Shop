// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: false,
//     images: {
//         domains: ['strapi-grocery-shop.onrender.com'],
//     },
//     env: {
//         API_URL: process.env.API_URL || 'https://strapi-grocery-shop.onrender.com',
//     },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'strapi-grocery-shopp.onrender.com',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },
    env: {
        API_URL: process.env.API_URL || 'https://strapi-grocery-shopp.onrender.com',
    },
};

export default nextConfig;




