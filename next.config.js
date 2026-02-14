/** @type {import('next').NextConfig} */
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
});

const nextConfig = {
    // Your other Next.js config options here
    reactStrictMode: true,
    turbopack: {},
};

export default withPWA(nextConfig);
