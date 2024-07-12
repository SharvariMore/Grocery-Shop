/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images:{
        domains:['localhost']
    },
    env: {
        API_URL: process.env.API_URL || 'http://localhost:1337',
    },
};

export default nextConfig;
