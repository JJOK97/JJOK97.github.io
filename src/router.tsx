import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/Layout/RootLayout';
import HomePage from './pages/Home';
import BlogPage from './pages/blog';
import BlogPostPage from './pages/blog/[slug]';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'blog',
        children: [
          {
            index: true,
            element: <BlogPage />,
          },
          {
            path: ':slug',
            element: <BlogPostPage />,
          },
        ],
      },
    ],
  },
]);
