import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-900">
            Inside Jinseok
          </Link>
          <div className="space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-900">
              Home
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-blue-900">
              Blog
            </Link>
            <a
              href="https://github.com/JJOK97"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};
