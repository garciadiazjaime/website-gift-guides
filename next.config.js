/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pyxis.nymag.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
