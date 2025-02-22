
import { useEffect, useState, useCallback, useRef } from 'react';
import imagesList from '../../../images.json';

export const BackgroundSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const preloadQueue = useRef<string[]>([]);
  const isPreloading = useRef(false);

  // Preload images in chunks
  const preloadNextBatch = useCallback(async () => {
    if (isPreloading.current || preloadQueue.current.length === 0) return;
    
    isPreloading.current = true;
    const batchSize = 3;
    const batch = preloadQueue.current.slice(0, batchSize);
    
    const loadPromises = batch.map(async (imagePath) => {
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.loading = 'lazy';
          img.decoding = 'async';
          img.onload = resolve;
          img.onerror = reject;
          img.src = imagePath;
        });
        return imagePath;
      } catch (error) {
        console.error(`Failed to load image: ${imagePath}`, error);
        return null;
      }
    });

    const loadedImages = (await Promise.all(loadPromises)).filter(Boolean) as string[];
    setPreloadedImages(prev => [...prev, ...loadedImages]);
    preloadQueue.current = preloadQueue.current.slice(batchSize);
    isPreloading.current = false;

    if (preloadQueue.current.length > 0) {
      setTimeout(preloadNextBatch, 1000); // Continue loading next batch after 1s
    }
  }, []);

  // Initialize preloading
  useEffect(() => {
    const firstImage = imagesList[0];
    // Start with first image
    const img = new Image();
    img.onload = () => {
      setPreloadedImages([firstImage]);
      setIsLoading(false);
      
      // Queue remaining images
      preloadQueue.current = imagesList.slice(1);
      preloadNextBatch();
    };
    img.src = firstImage;

    return () => {
      preloadQueue.current = [];
    };
  }, [preloadNextBatch]);

  // Handle background rotation
  useEffect(() => {
    if (preloadedImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % preloadedImages.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [preloadedImages.length]);

  // Placeholder while loading
  if (preloadedImages.length === 0) {
    return <div className="fixed inset-0 bg-[#0A1929] z-[-1]" />;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 z-[-1] blur-[8px] grayscale-[30%] will-change-transform"
        style={{
          backgroundImage: `url(${preloadedImages[currentImageIndex]})`,
          opacity: isLoading ? 0 : 1,
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
      />
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[-1]" />
    </>
  );
};
