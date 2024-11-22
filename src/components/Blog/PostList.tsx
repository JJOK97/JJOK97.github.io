interface Post {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

interface PostListProps {
  posts: Post[];
}

import { PostCard } from './PostCard';

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  );
};
