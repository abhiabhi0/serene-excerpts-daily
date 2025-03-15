
import { GratitudeAffirmations as GratitudeAffirmationsComponent } from "@/components/excerpt/GratitudeAffirmations";
import Footer from '@/components/Footer';

const GratitudeAffirmationsPage = () => {
  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col">
      <div className="container max-w-[clamp(16rem,90vw,42rem)] mx-auto flex-grow pt-8 flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl font-semibold text-center text-white mb-2">Gratitude & Affirmations</h1>
        <p className="text-center text-white/80 mb-8">Express gratitude and set powerful affirmations for your journey.</p>
        
        <GratitudeAffirmationsComponent />
      </div>
      <Footer />
    </div>
  );
};

export default GratitudeAffirmationsPage;
