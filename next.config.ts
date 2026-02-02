/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Обязательно! Это создает папку 'out'
  images: {
    unoptimized: true, // Нужно, чтобы картинки работали без сервера
  },
};

export default nextConfig;v
