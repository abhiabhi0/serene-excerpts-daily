
import { useEffect, useState } from "react";

const backgroundImages = [
  'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb', // blue starry night
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', // foggy mountain
  'https://images.unsplash.com/photo-1501854140801-50d01698950b', // bird's eye mountains
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e', // sun rays mountains
  'https://images.unsplash.com/photo-1439337153520-7082a56a81f4', // glass roof
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716', // bridge waterfalls
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
