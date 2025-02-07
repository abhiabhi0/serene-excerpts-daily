
import { useEffect, useState } from "react";

const backgroundImages = [
  'https://images.unsplash.com/photo-1528319725582-ddc096101511', // Person meditating in nature
  'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc', // Sunset meditation
  'https://images.unsplash.com/photo-1508672019048-805c876b67e2', // Buddha statue
  'https://images.unsplash.com/photo-1531685250784-7569952593d2', // Zen stones
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88', // Peaceful forest
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115', // Lotus flower
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

