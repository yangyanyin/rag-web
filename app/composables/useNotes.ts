// 构建时把 md 文件作为纯文本读进来（路径相对于当前文件）
const files = import.meta.glob('../assets/document/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface Note {
  slug: string
  title: string
  content: string
}

export function getNotes(): Note[] {
  return Object.entries(files).map(([path, content]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '') // 文件名当路由
    // 标题：取第一个 # 开头的标题行，没有就用文件名
    const title = content.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim() || slug
    return { slug, title, content }
  })
}