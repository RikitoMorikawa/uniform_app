import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";

// フォント設定の最適化
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: {
    default: "ユニフォームナビ | 現場のチカラ - 作業服情報サイト",
    template: "%s | ユニフォームナビ",
  },
  description: "作業服・ユニフォームの選び方や最新情報を提供する専門メディア。現場で働く人のための実用的な情報を発信します。",
  keywords: "作業服, ユニフォーム, ワークウェア, 空調服, 警備服, 作業着, 安全服, 制服, 現場, 快適",
  authors: [{ name: "ユニフォームナビ編集部" }],
  generator: "Next.js",
  applicationName: "ユニフォームナビ",
  referrer: "origin-when-cross-origin",
  creator: "ユニフォームナビ",
  publisher: "ユニフォームナビ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://uniform-navi.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ja-JP": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://uniform-navi.com",
    siteName: "ユニフォームナビ",
    title: "ユニフォームナビ | 現場のチカラ - 作業服情報サイト",
    description: "作業服・ユニフォームの選び方や最新情報を提供する専門メディア。現場で働く人のための実用的な情報を発信します。",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ユニフォームナビ - 作業服情報サイト",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ユニフォームナビ | 現場のチカラ - 作業服情報サイト",
    description: "作業服・ユニフォームの選び方や最新情報を提供する専門メディア",
    images: ["/og-image.jpg"],
    creator: "@uniform_navi", // Twitterアカウントがあれば設定
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  verification: {
    google: "あなたのGoogle Search Console確認コード",
    yandex: "あなたのYandex確認コードがあれば",
    yahoo: "あなたのYahoo JAPANの確認コードがあれば",
  },
  category: "ワークウェア,作業服,ユニフォーム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning className={`${inter.variable} ${notoSans.variable}`}>
      <head>
        {/* preconnect や preload を追加してパフォーマンスを向上 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA対応のためのマニフェスト */}
        <link rel="manifest" href="/manifest.json" />

        {/* IE対応（必要であれば） */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Schema.org 基本マークアップ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ユニフォームナビ",
              alternateName: "現場のチカラ - 作業服情報サイト",
              url: "https://uniform-navi.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://uniform-navi.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ユニフォームナビ",
              url: "https://uniform-navi.com",
              logo: "https://uniform-navi.com/logo.png",
              sameAs: [
                // SNSアカウントがあれば追加
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Analytics /> {/* Vercel Analytics の追加 */}
        </ThemeProvider>
      </body>
    </html>
  );
}
