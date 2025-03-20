// app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { BlogPost } from "@/types/BlogPost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://uniform-navi.com";

  try {
    // 全記事を取得
    const posts = await getAllPosts();

    // 記事のURL設定
    const postsUrls = posts.map((post: BlogPost) => ({
      url: `${baseUrl}/posts/${post.id}`,
      lastModified: post.updatedAt || post.date || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // 固定ページの設定
    const routes = ["", "/contact", "/privacy-policy"].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    }));

    // 明示的な戻り値
    return [...routes, ...postsUrls];
  } catch (error) {
    console.error("サイトマップの生成中にエラーが発生しました:", error);

    // エラー時でも空の配列を返す（サーバーエラーを防ぐ）
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 1.0,
      },
    ];
  }
}
