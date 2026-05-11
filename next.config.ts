// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // ← yeh line static files banayegi
  basePath: '/gaffe-tool', // ← apna GitHub REPO NAME likho
   assetPrefix: "/gaffe-tool/",
  trailingSlash: true,        // ← GitHub Pages ke liye zaroori
  images: {
    unoptimized: true,        
  },
};

module.exports = nextConfig;