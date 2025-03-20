// lib/font.ts
import { Inter, Noto_Sans_JP } from "next/font/google";

// Latin文字用のフォント
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// 日本語フォント
export const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false, // 必要なときに読み込みパフォーマンス向上
  variable: "--font-noto-sans",
});

// スタイル用の変数を追加（tailwind.config.jsで使用）
/*
// tailwind.config.jsの例
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans)', 'var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
*/
