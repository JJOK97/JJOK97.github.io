import { Link } from 'react-router-dom';

interface PostCardProps {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

export const PostCard = ({ title, date, excerpt, slug }: PostCardProps) => {
  return (
    <Link to={`/blog/${slug}`} className="block">
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
        <time className="text-sm text-blue-600">{date}</time>
        <h2 className="text-xl font-semibold text-gray-900 mt-2">{title}</h2>
        <p className="text-gray-600 mt-2">{excerpt}</p>
        <span className="text-blue-600 inline-block mt-4">Read more →</span>
      </article>
    </Link>
  );
};
