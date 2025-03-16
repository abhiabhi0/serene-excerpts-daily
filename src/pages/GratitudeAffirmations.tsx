
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GratitudeAffirmations } from "@/components/excerpt/GratitudeAffirmations";
import Footer from '@/components/Footer';

const GratitudeAffirmationsPage = () => {
  return (
    <div className="min-h-screen p-4 relative bg-[#0A1929]">
      <div className="container max-w-[clamp(16rem,90vw,42rem)] mx-auto pt-8 flex flex-col gap-4 md:gap-8 relative z-10">
        <Card className="overflow-hidden border-[#1A4067]/30 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6 flex flex-col gap-4">
            <div className="text-center mb-4">
              <h1 className="text-xl md:text-2xl font-semibold mb-2">Gratitude & Affirmations</h1>
              <p className="text-sm text-muted-foreground">
                Record your blessings and positive affirmations to reinforce your spiritual practice
              </p>
            </div>
            
            <GratitudeAffirmations />

            <div className="mt-4 text-center">
              <a 
                href="/" 
                className="inline-block px-4 py-2 bg-[#1A4067]/50 hover:bg-[#1A4067]/80 rounded-lg text-sm font-medium transition-colors"
              >
                Return to Home
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default GratitudeAffirmationsPage;
