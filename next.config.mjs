/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['strapi-grocery-shop.onrender.com'],
    },
    env: {
        API_URL: process.env.API_URL || 'https://strapi-grocery-shop.onrender.com',
    },
};

export default nextConfig;
