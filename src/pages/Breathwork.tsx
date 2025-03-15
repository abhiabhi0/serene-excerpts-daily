import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Footer from '@/components/Footer';
import { CirclePause, Wind } from 'lucide-react';

const Breathwork = () => {
  const [isActive, setIsActive] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startBreathwork = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsActive(true);
      setAnimationComplete(false);
      
      animationRef.current = setTimeout(() => {
        setIsActive(false);
        setAnimationComplete(true);
        toast({
          title: "Breathwork Complete",
          description: "Great job! You've completed your one-minute breathwork session.",
        });
      }, 60000);
    }, 1500);
  };

  const stopBreathwork = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col">
      <style>{`
        .gradient-loader {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          height: 96px;
          width: 96px;
          animation: rotate_loader 1.2s linear infinite;
          background-color: #0ea5e9;
          background-image: linear-gradient(#0ea5e9, #2563eb, #6366f1);
        }

        .gradient-loader span {
          position: absolute;
          border-radius: 50%;
          height: 100%;
          width: 100%;
          background-color: #0ea5e9;
          background-image: linear-gradient(#0ea5e9, #2563eb, #6366f1);
        }

        .gradient-loader span:nth-of-type(1) {
          filter: blur(5px);
        }

        .gradient-loader span:nth-of-type(2) {
          filter: blur(10px);
        }

        .gradient-loader span:nth-of-type(3) {
          filter: blur(25px);
        }

        .gradient-loader span:nth-of-type(4) {
          filter: blur(50px);
        }

        .gradient-loader::after {
          content: "";
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          background-color: #0A1929;
          border: solid 5px #0c2237;
          border-radius: 50%;
        }

        @keyframes rotate_loader {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>

      <div className="container max-w-[clamp(16rem,90vw,42rem)] mx-auto flex-grow pt-8 flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl font-semibold text-center text-white mb-2">One Minute Breathwork</h1>
        <p className="text-center text-white/80 mb-8">Take a moment to breathe deeply and refocus your mind.</p>
        
        <div className="w-full flex flex-col items-center justify-center">
          {isLoading ? (
            <GradientLoader />
          ) : !isActive ? (
            <Button 
              onClick={startBreathwork}
              className="px-8 py-6 rounded-full text-lg flex items-center gap-2"
              size="lg"
            >
              {animationComplete ? 'Breathe Again' : 'Start Breathing'} <Wind className="ml-2" />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={stopBreathwork}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 rounded-full"
            >
              <CirclePause className="mr-2" /> End Session
            </Button>
          )}
          
          {isActive && <GradientLoader />}
        </div>
        
        {!isActive && animationComplete && (
          <div className="text-center text-white/80 animate-fade-in mt-4">
            <p>How do you feel?</p>
            <p className="text-sm mt-2">Remember, you can return anytime for a breathing break.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const GradientLoader = () => {
  return (
    <div className="relative h-24 w-24">
      <div className="gradient-loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Breathwork;
