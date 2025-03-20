/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // 既存の設定を保持
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // マークダウンファイルのローダー設定を追加
    config.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: "raw-loader",
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
