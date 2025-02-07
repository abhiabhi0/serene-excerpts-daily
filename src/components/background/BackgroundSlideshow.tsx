
import { useEffect, useState } from "react";

const backgroundImages = [
  '/lovable-uploads/bg-images/pexels-aronvisuals-1694621.jpg',
  '/lovable-uploads/bg-images/pexels-azharphotography-8230166.jpg',
  '/lovable-uploads/bg-images/pexels-being-the-traveller-579914-2619724.jpg',
  '/lovable-uploads/bg-images/pexels-mali-1278952.jpg',
  '/lovable-uploads/bg-images/pexels-pixabay-248032.jpg',
  '/lovable-uploads/bg-images/pexels-pixabay-268134.jpg',
  '/lovable-uploads/bg-images/pexels-prasanthinturi-1051838.jpg',
  '/lovable-uploads/bg-images/pexels-rahulp9800-9835791.jpg',
  '/lovable-uploads/bg-images/pexels-ravikant-5406476.jpg',
];

export const BackgroundSlideshow = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 transition-opacity duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25,
      }}
    />
  );
};
