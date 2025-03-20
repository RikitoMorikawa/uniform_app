"use client";

import { formatDate } from "@/lib/utils";
import { Share2, Clock, Tag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// WorkwearSelectorをクライアントサイドのみでレンダリングするために動的インポートを使用
const WorkwearSelector = dynamic(() => import("./workwear-selector"), { ssr: false });

interface BlogLayoutProps {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  children: React.ReactNode;
}

export default function BlogLayout({ title, date, category, excerpt, children }: BlogLayoutProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: shareUrl,
        });
      } catch (error) {
        console.error("共有に失敗しました:", error);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        {/* ナビゲーションとシェアボタン */}
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            記事一覧に戻る
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-500 text-green-600 hover:bg-green-100 transition-all hover:scale-105 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            記事をシェア
          </button>
        </div>

        <article className="max-w-4xl mx-auto px-4 pb-16">
          {/* 記事本文 */}
          <div className="prose prose-lg dark:prose-invert max-w-none bg-card rounded-2xl p-8 shadow-lg shadow-primary/5 border border-primary/5">
            {/* 日付とカテゴリー */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 non-prose">
              <div className="flex items-center gap-2 bg-muted/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                <time dateTime={date}>{formatDate(new Date(date))}</time>
              </div>
              <Link href={`/`} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
                <Tag className="h-4 w-4" />
                {category}
              </Link>
            </div>

            <div
              className="prose-headings:font-bold
                          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                          prose-img:rounded-lg prose-img:shadow-md
                          prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                          prose-pre:bg-muted/50 prose-pre:shadow-inner"
            >
              {children}
            </div>
          </div>
        </article>
      </div>

      {/* 作業服セレクターをページコンテンツの外に配置 */}
      <WorkwearSelector />
    </>
  );
}
