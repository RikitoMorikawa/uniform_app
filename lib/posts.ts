import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { Post } from '@/types/post'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getAllPosts(): Promise<Post[]> {
  // ファイルシステムからの記事取得
  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '')
      return await getPostById(id)
    })
  )

  // 日付でソート
  return allPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // マークダウンのメタデータを解析
    const matterResult = matter(fileContents)

    // マークダウンをHTMLに変換
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      category: matterResult.data.category,
      excerpt: matterResult.data.excerpt,
      keywords: matterResult.data.keywords,
      content: contentHtml,
    }
  } catch (error) {
    return null
  }
}