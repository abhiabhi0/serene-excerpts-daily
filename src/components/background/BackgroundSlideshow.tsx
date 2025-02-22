
import { useEffect, useState, useCallback } from 'react';
import imagesList from '../../../images.json';

export const BackgroundSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Preload all images initially
  const preloadInitialImages = useCallback(async () => {
    const loadedImages: string[] = [];

    for (const imagePath of imagesList) {
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = imagePath;
        });
        loadedImages.push(imagePath);
      } catch (error) {
        console.error(`Failed to load image: ${imagePath}`, error);
      }
    }

    setPreloadedImages(loadedImages);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    preloadInitialImages();

    // Rotate background every 30 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesList.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [preloadInitialImages]);

  if (preloadedImages.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#0A1929] z-[-1]" />
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 z-[-1] blur-[8px] grayscale-[30%]"
        style={{
          backgroundImage: `url(${preloadedImages[currentImageIndex]})`,
          opacity: isLoading ? 0 : 1,
        }}
      />
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[-1]" />
    </>
  );
};
