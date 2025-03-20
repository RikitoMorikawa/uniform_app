import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "ワークウェアブログ | 作業服・空調服・警備服の専門情報サイト",
  description:
    "作業服、空調服、警備服に関する最新情報や専門知識をお届けするブログサイトです。実用的なアドバイスから製品レビューまで、現場で役立つ情報を提供します。",
  keywords: "作業服, 空調服, 警備服, ワークウェア, 作業着, 安全服, 制服",
  icons: {
    icon: "/favicon.png", // PNGファイルを指定
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Analytics /> {/* Vercel Analytics の追加 */}
        </ThemeProvider>
      </body>
    </html>
  );
}