import { useParams } from 'react-router-dom';
import { MarkdownContent } from '../../components/Blog/MarkdownContent';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  // 실제로는 slug를 기반으로 마크다운 파일을 불러와야 합니다
  const post = {
    title: '첫 번째 블로그 포스트',
    date: '2024-11-22',
    content: '# 첫 번째 포스트\n\n블로그를 시작하며...',
    tags: ['blog', 'first'],
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <time className="text-gray-600">{post.date}</time>
      </header>
      <div className="prose prose-blue max-w-none">
        <MarkdownContent content={post.content} />
      </div>
      <footer className="mt-8 pt-8 border-t">
        <div className="flex gap-2">
          {post.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
}
