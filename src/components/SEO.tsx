import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  article?: boolean;
}

export const SEO = ({ title, description, image, article }: SEOProps) => {
  const siteTitle = 'Inside Jinseok';
  const defaultDescription =
    '웹 개발, 클린 코드, 그리고 소프트웨어 엔지니어링에 대한 이야기를 공유합니다.';

  return (
    <Helmet>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};
