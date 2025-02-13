
import { useEffect, useState } from "react";

const backgroundImages = [
  "/lovable-uploads/bg-images/AlbedoBase_XL_A_mystical_reflection_of_the_universe_on_a_clear_0.jpg",
  "/lovable-uploads/bg-images/AlbedoBase_XL_A_mystical_reflection_of_the_universe_on_a_clear_1.jpg",
  "/lovable-uploads/bg-images/AlbedoBase_XL_A_mystical_reflection_of_the_universe_on_a_clear_2.jpg",
  "/lovable-uploads/bg-images/AlbedoBase_XL_A_mystical_reflection_of_the_universe_on_a_clear_3.jpg",
  "/lovable-uploads/bg-images/AlbedoBase_XL_highquality_mystical_depiction_of_the_ancient_V_0.jpg",
  "/lovable-uploads/bg-images/IMG_20241029_113159_922.jpg",
  "/lovable-uploads/bg-images/IMG_20241103_164418_778.jpg",
  "/lovable-uploads/bg-images/IMG_20241107_190553_645.jpg",
  "/lovable-uploads/bg-images/IMG_20241108_130344_457.jpg",
  "/lovable-uploads/bg-images/IMG_20241110_132736_887.jpg",
  "/lovable-uploads/bg-images/IMG_20241118_124700_298.jpg",
  "/lovable-uploads/bg-images/IMG_20241121_124800_087.jpg",
  "/lovable-uploads/bg-images/IMG_20241121_124803_461.jpg",
  "/lovable-uploads/bg-images/IMG_20250209_193408_631.jpg",
  "/lovable-uploads/bg-images/Leonardo_Kino_XL_A_mystical_reflection_of_the_universe_on_a_cl_0.jpg",
  "/lovable-uploads/bg-images/Leonardo_Kino_XL_A_mystical_reflection_of_the_universe_on_a_cl_1.jpg",
  "/lovable-uploads/bg-images/Leonardo_Kino_XL_A_mystical_reflection_of_the_universe_on_a_cl_2.jpg",
  "/lovable-uploads/bg-images/Leonardo_Kino_XL_A_mystical_reflection_of_the_universe_on_a_cl_3.jpg",
  "/lovable-uploads/bg-images/Leonardo_Kino_XL_highquality_mystical_depiction_of_the_ancien_0.jpg",
  "/lovable-uploads/bg-images/Leonardo_Kino_XL_highquality_mystical_depiction_of_the_ancien_3.jpg",
  "/lovable-uploads/bg-images/Leonardo_Phoenix_Lord_Shiva_and_Parvati_sitting_together_in_a_0.jpg",
  "/lovable-uploads/bg-images/pexels-aronvisuals-1694621.jpg",
  "/lovable-uploads/bg-images/pexels-azharphotography-8230166.jpg",
  "/lovable-uploads/bg-images/pexels-being-the-traveller-579914-2619724.jpg",
  "/lovable-uploads/bg-images/pexels-mali-1278952.jpg",
  "/lovable-uploads/bg-images/pexels-pixabay-248032.jpg",
  "/lovable-uploads/bg-images/pexels-pixabay-268134.jpg",
  "/lovable-uploads/bg-images/pexels-prasanthinturi-1051838.jpg",
  "/lovable-uploads/bg-images/pexels-rahulp9800-9835791.jpg",
  "/lovable-uploads/bg-images/pexels-ravikant-5406476.jpg",
  "/lovable-uploads/bg-images/thumb (10).png",
  "/lovable-uploads/bg-images/thumb (12).png",
  "/lovable-uploads/bg-images/thumb (14).png",
  "/lovable-uploads/bg-images/thumb (16).png",
  "/lovable-uploads/bg-images/thumb (17).png",
  "/lovable-uploads/bg-images/thumb (3).png",
  "/lovable-uploads/bg-images/Untitled (1).png",
  "/lovable-uploads/bg-images/Untitled (2).png",
  "/lovable-uploads/bg-images/Untitled (3).png",
  "/lovable-uploads/bg-images/Untitled (4).png",
  "/lovable-uploads/bg-images/Untitled (5).png",
  "/lovable-uploads/bg-images/Untitled (6).png"
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
