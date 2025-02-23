import { useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  placeholderSrc,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver({
    ref: imageRef,
    freezeOnceVisible: true,
  });

  return (
    <div className="relative overflow-hidden">
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 blur-sm animate-pulse bg-muted',
            className
          )}
          style={{
            backgroundImage: placeholderSrc ? `url(${placeholderSrc})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <img
        ref={imageRef}
        src={isVisible ? src : ''}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
} 