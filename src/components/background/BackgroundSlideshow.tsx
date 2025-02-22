
import { useEffect, useState, useCallback } from 'react';
import imagesList from '../../../images.json';

export const BackgroundSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Preload a subset of images initially
  const preloadInitialImages = useCallback(async () => {
    const initialImagesToLoad = imagesList.slice(0, 5); // Load first 5 images
    const loadedImages: string[] = [];

    for (const imagePath of initialImagesToLoad) {
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.loading = "lazy"; // Add lazy loading
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
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % preloadedImages.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [preloadedImages.length, preloadInitialImages]);

  // Add progressive loading of remaining images
  useEffect(() => {
    if (!isLoading) {
      const remainingImages = imagesList.slice(5);
      let loadedCount = 0;

      const loadNextImage = async () => {
        if (loadedCount < remainingImages.length) {
          const imagePath = remainingImages[loadedCount];
          try {
            await new Promise((resolve, reject) => {
              const img = new Image();
              img.loading = "lazy";
              img.onload = resolve;
              img.onerror = reject;
              img.src = imagePath;
            });
            setPreloadedImages(prev => [...prev, imagePath]);
            loadedCount++;
            if (loadedCount < remainingImages.length) {
              setTimeout(loadNextImage, 1000); // Load next image after 1 second
            }
          } catch (error) {
            console.error(`Failed to load image: ${imagePath}`, error);
            loadedCount++;
            setTimeout(loadNextImage, 1000);
          }
        }
      };

      loadNextImage();
    }
  }, [isLoading]);

  if (preloadedImages.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#0A1929] z-[-1]" />
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 z-[-1]"
        style={{
          backgroundImage: `url(${preloadedImages[currentImageIndex]})`,
          opacity: isLoading ? 0 : 1
        }}
      />
      <div className="fixed inset-0 bg-black/50 z-[-1]" />
    </>
  );
};
