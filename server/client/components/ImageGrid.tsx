import React, { useEffect, useRef, useCallback } from 'react';
import type { ImageResponse } from '../types/index';
import ImageCard from './ImageCard';

interface ImageGridProps {
  images: ImageResponse[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onTagClick: (tagName: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  loading,
  hasMore,
  onLoadMore,
  onTagClick,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    setupObserver();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);

  if (images.length === 0 && !loading) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4 animate-fade-in">
        <div className="text-6xl filter drop-shadow-[0_8px_16px_var(--color-accent-glow)]">🖼️</div>
        <h3 className="font-display font-medium text-2xl text-text-primary mt-2">No images found</h3>
        <p className="text-text-secondary text-lg max-w-sm">Try selecting different tags or clear your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative mt-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 w-full opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="w-full inline-block relative overflow-hidden rounded-[20px] bg-bg-card border border-border-card shadow-[0_8px_24px_-8px_var(--color-accent-glow)] transition-all duration-300 hover:shadow-[0_20px_40px_-12px_var(--color-accent-glow)] opacity-0 animate-[fadeIn_0.6s_ease-out_forwards] break-inside-avoid"
            style={{
              animationDelay: `${(index % 12) * 0.05}s`,
            }}
          >
            <ImageCard image={image} onTagClick={onTagClick} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="flex gap-2 isolate relative scale-150 mb-2">
            <div className="absolute inset-0 bg-accent-glow blur-[30px] -z-10 rounded-full" />
            <div className="w-2.5 h-2.5 bg-accent-primary rounded-full animate-[float_1.2s_ease-in-out_infinite]" />
            <div className="w-2.5 h-2.5 bg-accent-primary rounded-full animate-[float_1.2s_ease-in-out_0.2s_infinite]" />
            <div className="w-2.5 h-2.5 bg-accent-primary rounded-full animate-[float_1.2s_ease-in-out_0.4s_infinite]" />
          </div>
          <p className="text-text-muted font-medium tracking-wide text-sm font-sans uppercase">Loading more images...</p>
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="w-full h-10 pointer-events-none opacity-0" />}

      {!hasMore && images.length > 0 && (
        <div className="flex items-center justify-center py-16 gap-6 w-full max-w-md mx-auto opacity-0 animate-fade-in">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-border-subtle to-border-card" />
          <span className="text-text-muted text-sm font-medium tracking-widest uppercase font-sans whitespace-nowrap">
            You&apos;ve seen all {images.length} images
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent via-border-subtle to-border-card" />
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
