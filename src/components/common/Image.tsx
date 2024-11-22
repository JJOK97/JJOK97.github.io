import { ImgHTMLAttributes } from 'react';

export const OptimizedImage = ({
  src,
  alt,
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`rounded-lg ${className || ''}`}
      {...props}
    />
  );
};
