import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Footer from '@/components/Footer';
import { CirclePause, Wind } from 'lucide-react';

const Breathwork = () => {
  const [isActive, setIsActive] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startBreathwork = () => {
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
      <div className="container max-w-[clamp(16rem,90vw,42rem)] mx-auto flex-grow pt-8 flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl font-semibold text-center text-white mb-2">One Minute Breathwork</h1>
        <p className="text-center text-white/80 mb-8">Take a moment to breathe deeply and refocus your mind.</p>
        
        <div className="w-full flex flex-col items-center justify-center">
          {!isActive ? (
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
          
          {isActive && <BreathingAnimation />}
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

const BreathingAnimation = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);
  const [size, setSize] = useState(40); // Initial size percentage
  
  useEffect(() => {
    let inhaleInterval: NodeJS.Timeout;
    let exhaleInterval: NodeJS.Timeout;
    let cycleTimer: NodeJS.Timeout;
    let phaseTimer: NodeJS.Timeout;
    
    const startInhalePhase = () => {
      setPhase('inhale');
      
      if (inhaleInterval) clearInterval(inhaleInterval);
      if (exhaleInterval) clearInterval(exhaleInterval);
      
      inhaleInterval = setInterval(() => {
        setSize(prev => {
          const newSize = prev + 0.5;
          return newSize <= 70 ? newSize : 70;
        });
      }, 50);
      
      phaseTimer = setTimeout(() => {
        clearInterval(inhaleInterval);
        startHoldPhase();
      }, 4000);
    };
    
    const startHoldPhase = () => {
      setPhase('hold');
      
      phaseTimer = setTimeout(() => {
        startExhalePhase();
      }, 4000);
    };
    
    const startExhalePhase = () => {
      setPhase('exhale');
      
      exhaleInterval = setInterval(() => {
        setSize(prev => {
          const newSize = prev - 0.5;
          return newSize >= 40 ? newSize : 40;
        });
      }, 50);
      
      phaseTimer = setTimeout(() => {
        clearInterval(exhaleInterval);
        setCount(prev => prev + 1);
        
        startInhalePhase();
      }, 4000);
    };
    
    startInhalePhase();
    
    return () => {
      clearInterval(inhaleInterval);
      clearInterval(exhaleInterval);
      clearTimeout(phaseTimer);
      clearTimeout(cycleTimer);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center h-80 w-80">
      <div className="absolute text-white/80 text-sm top-2 transition-opacity duration-500">
        {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
      </div>
      
      <div 
        className="relative rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center"
        style={{
          width: `${size}%`,
          height: `${size}%`,
          transition: 'all 0.25s ease-in-out'
        }}
      >
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-cyan-500/5 border border-cyan-500/30"></div>
        
        <Wind className="text-white/60" size={40} />
      </div>
    </div>
  );
};

export default Breathwork;
