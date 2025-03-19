"use client";

import { formatDate } from "@/lib/utils";
import { Share2, Clock, Tag, ChevronLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      {/* ナビゲーション */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          記事一覧に戻る
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 pb-16">
        {/* ヒーローセクション */}
        <div className="relative mb-16 p-8 rounded-2xl bg-gradient-to-br from-card via-card/95 to-muted/30 border border-primary/5 shadow-lg shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2 bg-muted/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                <time dateTime={date}>{formatDate(new Date(date))}</time>
              </div>
              <Link
                // href={`/category/${category.toLowerCase()}`}
                href={`/`}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
              >
                <Tag className="h-4 w-4" />
                {category}
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center leading-relaxed">{excerpt}</p>
          </div>
        </div>

        {/* シェアボタン */}
        <div className="flex justify-center mb-16">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Share2 className="h-5 w-5" />
            記事をシェア
          </button>
        </div>

        {/* 記事本文 */}
        <div className="prose prose-lg dark:prose-invert max-w-none bg-card rounded-2xl p-8 shadow-lg shadow-primary/5 border border-primary/5">
          <div
            className="prose-headings:bg-clip-text prose-headings:text-transparent prose-headings:bg-gradient-to-r prose-headings:from-foreground prose-headings:via-foreground/90 prose-headings:to-foreground/80
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
  );
}
