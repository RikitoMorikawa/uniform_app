import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Post } from "@/types/post";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getAllPosts(): Promise<Post[]> {
  // ファイルシステムからの記事取得
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const post = await getPostById(id);
        if (!post) throw new Error(`Post not found: ${id}`);
        return post;
      })
  );

  // 日付でソート
  return allPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags && post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // マークダウンのメタデータを解析
    const matterResult = matter(fileContents);

    // マークダウンをHTMLに変換
    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml = processedContent.toString();

    // マークダウンの最初の画像を抽出（サムネイルが設定されていない場合に使用）
    let firstImage = null;
    if (!matterResult.data.thumbnail) {
      // Markdownの画像構文 ![alt](url) または <img src="url"> を検出
      const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
      const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/;

      const markdownMatch = matterResult.content.match(markdownImageRegex);
      const htmlMatch = matterResult.content.match(htmlImageRegex);

      if (markdownMatch && markdownMatch[1]) {
        firstImage = markdownMatch[1].trim();
      } else if (htmlMatch && htmlMatch[1]) {
        firstImage = htmlMatch[1].trim();
      }
    }

    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      category: matterResult.data.category,
      excerpt: matterResult.data.excerpt,
      keywords: matterResult.data.keywords,
      content: contentHtml,
      tags: matterResult.data.tags || [],
      thumbnail: matterResult.data.thumbnail || firstImage,
      author: matterResult.data.author,
      updatedAt: matterResult.data.updatedAt || matterResult.data.date,
    };
  } catch (error) {
    console.error(`Error loading post ${id}:`, error);
    return null;
  }
}
