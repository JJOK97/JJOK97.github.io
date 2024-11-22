import matter from 'gray-matter';
import { Post } from '../types/post';

export const parseMarkdownFile = (fileName: string, content: string): Post => {
  const { data, content: markdownContent } = matter(content);

  return {
    title: data.title,
    date: data.date,
    excerpt: data.excerpt || '',
    content: markdownContent,
    slug: fileName.replace(/\.md$/, ''),
    tags: data.tags || [],
  };
};
