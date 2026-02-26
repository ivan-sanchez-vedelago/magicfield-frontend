/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // TODO: Configurar patrones de imágenes externas según proveedor
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
