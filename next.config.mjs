/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.STATIC_EXPORT ? 'export' : undefined, // allows `npm run export` for GitHub Pages
  images: { unoptimized: true } // export-friendly
};
export default nextConfig;
