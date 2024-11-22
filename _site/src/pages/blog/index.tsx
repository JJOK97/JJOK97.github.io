import { useState } from 'react';
import { Post } from '../../types/post';
import { PostList } from '../../components/Blog/PostList';

export default function BlogPage() {
  const [posts] = useState<Post[]>([
    {
      title: '첫 번째 블로그 포스트',
      date: '2024-11-22',
      excerpt: '블로그를 시작하며...',
      content: '# 첫 번째 포스트\n\n블로그를 시작하며...',
      slug: 'first-post',
      tags: ['blog', 'first'],
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>
      <PostList posts={posts} />
    </div>
  );
}
